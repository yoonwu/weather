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
    const [openMeteo, nominatim] = await Promise.all([
      searchOpenMeteo(query),
      searchNominatim(query)
    ]);
    sendJson(res, 200, { results: uniquePlaces([...openMeteo, ...nominatim]).slice(0, 10) });
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
  const url = buildUrl("https://nominatim.openstreetmap.org/search", {
    q: query,
    format: "json",
    limit: 8,
    countrycodes: "kr",
    "accept-language": "ko"
  });
  const data = await cachedJson(url, CACHE_TTL_MS, {
    "User-Agent": "coast-forecast-compare/1.0 contact: local-dev"
  });
  return (Array.isArray(data) ? data : []).map((item) => ({
    id: `osm-${item.place_id}`,
    name: item.name || item.display_name.split(",")[0],
    label: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    source: "OpenStreetMap Nominatim"
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
