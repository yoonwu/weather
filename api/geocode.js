const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map();

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url, "http://localhost");
  const query = (url.searchParams.get("q") || "").trim();
  if (!query) {
    sendJson(res, 400, { error: "bad_request", message: "검색어가 필요합니다." });
    return;
  }

  try {
    const searches = [searchOpenMeteo(query), searchNominatim(query)];
    if (process.env.KAKAO_REST_API_KEY) searches.unshift(searchKakao(query));
    const settled = await Promise.allSettled(searches);
    const places = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);
    const errors = settled.filter((result) => result.status === "rejected");
    if (!places.length && errors.length === settled.length) throw errors[0].reason;
    sendJson(res, 200, { results: rankPlaces(uniquePlaces(places), query).slice(0, 10) });
  } catch (error) {
    sendJson(res, 500, {
      error: "geocode_failed",
      message: error.message || "장소 검색 중 오류가 발생했습니다."
    });
  }
};

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.end(JSON.stringify(payload));
}

async function searchKakao(query) {
  const url = buildUrl("https://dapi.kakao.com/v2/local/search/keyword.json", {
    query,
    size: 10
  });
  const data = await cachedJson(url, CACHE_TTL_MS, {
    Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
  });
  return (data.documents || []).map((item) => ({
    id: `kakao-${item.id}`,
    name: item.place_name,
    label: [item.road_address_name || item.address_name, item.category_name].filter(Boolean).join(" · "),
    latitude: Number(item.y),
    longitude: Number(item.x),
    type: categoryType(item.category_name),
    source: "카카오 장소"
  }));
}

async function searchOpenMeteo(query) {
  const url = buildUrl("https://geocoding-api.open-meteo.com/v1/search", {
    name: query,
    count: 8,
    language: "ko",
    format: "json"
  });
  const data = await cachedJson(url);
  return (data.results || []).map((item) => ({
    id: `openmeteo-${item.id}`,
    name: item.name,
    label: [item.name, item.admin1, item.country].filter(Boolean).join(", "),
    latitude: item.latitude,
    longitude: item.longitude,
    source: "Open-Meteo Geocoding"
  }));
}

async function searchNominatim(query) {
  const primary = await requestNominatim(query);
  if (primary.length) return primary;

  const fallbackQuery = koreanPlaceFallback(query);
  if (!fallbackQuery || fallbackQuery === query) return primary;
  await delay(1100);
  return requestNominatim(fallbackQuery);
}

async function requestNominatim(query) {
  const url = buildUrl("https://nominatim.openstreetmap.org/search", {
    q: query,
    format: "json",
    limit: 8,
    countrycodes: "kr",
    "accept-language": "ko",
    addressdetails: 1,
    namedetails: 1
  });
  const data = await cachedJson(url, CACHE_TTL_MS, {
    "User-Agent": "coast-forecast-compare/1.0 contact: local-dev"
  });
  return (Array.isArray(data) ? data : []).map((item) => ({
    id: `osm-${item.place_id}`,
    name: item.namedetails?.["name:ko"] || item.name || item.display_name.split(",")[0],
    label: cleanDisplayName(item.display_name),
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    type: item.type,
    source: "OpenStreetMap"
  }));
}

async function cachedJson(url, ttl = CACHE_TTL_MS, headers = {}) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && hit.expiresAt > now) return hit.data;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 120)}`);
  }
  const data = await response.json();
  cache.set(url, { data, expiresAt: now + ttl });
  return data;
}

function buildUrl(base, params) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function uniquePlaces(places) {
  const seen = new Set();
  return places.filter((place) => {
    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) return false;
    const key = `${Math.round(place.latitude * 1000)}:${Math.round(place.longitude * 1000)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rankPlaces(places, query) {
  const target = compactText(query);
  const fallback = compactText(koreanPlaceFallback(query));
  return places
    .map((place, index) => ({ place, index, score: placeScore(place, target, fallback) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.place);
}

function placeScore(place, target, fallback) {
  const name = compactText(place.name);
  let score = 0;
  if (name === target) score += 100;
  if (name.startsWith(target) || (fallback && name.startsWith(fallback))) score += 65;
  if (name.includes(target) || (fallback && name.includes(fallback))) score += 40;
  if (place.type === "beach") score += 24;
  if (place.source === "카카오 장소") score += 8;
  return score;
}

function koreanPlaceFallback(query) {
  return String(query)
    .trim()
    .replace(/(해수욕장|해변|비치)$/u, "")
    .replace(/(리조트|호텔|펜션)$/u, "")
    .trim();
}

function cleanDisplayName(label) {
  return String(label || "")
    .replace(/,\s*대한민국$/u, "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join(" · ");
}

function compactText(value) {
  return String(value || "").toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

function categoryType(category) {
  if (/해수욕장|해변|해양레저/u.test(category || "")) return "beach";
  if (/숙박|호텔|리조트|펜션/u.test(category || "")) return "hotel";
  return "place";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
