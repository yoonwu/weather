const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map();

const MODELS = [
  { id: "ecmwf", label: "ECMWF", suffix: "ecmwf_ifs" },
  { id: "gfs", label: "GFS", suffix: "gfs_seamless" },
  { id: "icon", label: "ICON", suffix: "icon_seamless" }
];

const OPEN_METEO_HOURLY = [
  "temperature_2m",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m",
  "cloud_cover",
  "weather_code"
];

const MARINE_HOURLY = [
  "wave_height",
  "wave_direction",
  "wave_period",
  "swell_wave_height",
  "swell_wave_period",
  "swell_wave_direction",
  "sea_surface_temperature",
  "ocean_current_velocity",
  "ocean_current_direction"
];

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, "http://localhost");
    const latitude = Number(url.searchParams.get("lat"));
    const longitude = Number(url.searchParams.get("lon"));
    const name = url.searchParams.get("name") || "선택 장소";
    const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 7, 2), 10);
    const kmaApiKey = readHeader(req, "x-kma-api-key");

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      sendJson(res, 400, { error: "bad_request", message: "lat, lon 쿼리 파라미터가 필요합니다." });
      return;
    }

    const [models, reference, marine, kma, accuweather] = await Promise.all([
      safePart("models", () => fetchModels(latitude, longitude, days)),
      safePart("reference", () => fetchReference(latitude, longitude, days)),
      safePart("marine", () => fetchMarine(latitude, longitude, days)),
      safePart("kma", () => fetchKma(latitude, longitude, kmaApiKey)),
      safePart("accuweather", () => fetchAccuWeather(latitude, longitude))
    ]);

    if (models.status === "ok" && marine.status === "ok") {
      attachLandWindToMarine(marine, models.models);
    }

    sendJson(res, 200, {
      generatedAt: new Date().toISOString(),
      timezone: "Asia/Seoul",
      place: { name, latitude, longitude },
      units: {
        temperature: "℃",
        windSpeed: "m/s",
        waveHeight: "m",
        wavePeriod: "초",
        precipitation: "mm"
      },
      models,
      reference,
      marine,
      kma,
      accuweather
    });
  } catch (error) {
    sendJson(res, 500, {
      error: "server_error",
      message: error.message || "예보 조회 중 오류가 발생했습니다."
    });
  }
};

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.end(JSON.stringify(payload));
}

function readHeader(req, name) {
  if (typeof req.headers?.get === "function") return req.headers.get(name) || "";

  const value = req.headers?.[name.toLowerCase()] || req.headers?.[name];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function cleanApiKey(value) {
  return String(value || "").trim();
}

async function safePart(id, fn) {
  try {
    return await fn();
  } catch (error) {
    const payload = {
      status: "error",
      id,
      message: error.message || "데이터를 불러오지 못했습니다.",
      updatedAt: new Date().toISOString()
    };
    if (id === "kma" && cleanApiKey(process.env.KMA_API_KEY)) payload.keySource = "server";
    return payload;
  }
}

async function fetchModels(latitude, longitude, days) {
  const url = buildUrl("https://api.open-meteo.com/v1/forecast", {
    latitude,
    longitude,
    hourly: OPEN_METEO_HOURLY.join(","),
    wind_speed_unit: "ms",
    timezone: "Asia/Seoul",
    forecast_days: days,
    models: MODELS.map((model) => model.suffix).join(",")
  });

  const raw = await cachedJson(url);
  const hourly = raw.hourly || {};
  const time = hourly.time || [];

  return {
    status: "ok",
    source: "Open-Meteo Forecast API",
    updatedAt: new Date().toISOString(),
    modelNames: MODELS.map((model) => model.label),
    models: MODELS.map((model) => ({
      id: model.id,
      label: model.label,
      sourceModel: model.suffix,
      hours: time.map((isoTime, index) => ({
        time: isoTime,
        precipitation: round(read(hourly, `precipitation_${model.suffix}`, index), 2),
        precipitationProbability: round(read(hourly, `precipitation_probability_${model.suffix}`, index), 0),
        temperature: round(read(hourly, `temperature_2m_${model.suffix}`, index), 1),
        windSpeed: round(read(hourly, `wind_speed_10m_${model.suffix}`, index), 1),
        gust: round(read(hourly, `wind_gusts_10m_${model.suffix}`, index), 1),
        windDirection: round(read(hourly, `wind_direction_10m_${model.suffix}`, index), 0),
        cloudCover: round(read(hourly, `cloud_cover_${model.suffix}`, index), 0),
        weatherCode: read(hourly, `weather_code_${model.suffix}`, index),
        weatherText: weatherText(read(hourly, `weather_code_${model.suffix}`, index))
      }))
    }))
  };
}

async function fetchReference(latitude, longitude, days) {
  const url = buildUrl("https://api.open-meteo.com/v1/forecast", {
    latitude,
    longitude,
    hourly: OPEN_METEO_HOURLY.join(","),
    daily: "sunrise,sunset,temperature_2m_max,temperature_2m_min",
    wind_speed_unit: "ms",
    timezone: "Asia/Seoul",
    forecast_days: days,
    models: "best_match"
  });

  const raw = await cachedJson(url);
  const hourly = raw.hourly || {};
  const daily = raw.daily || {};

  return {
    status: "ok",
    source: "Open-Meteo best_match",
    updatedAt: new Date().toISOString(),
    daily: (daily.time || []).map((date, index) => ({
      date,
      sunrise: read(daily, "sunrise", index),
      sunset: read(daily, "sunset", index),
      temperatureMax: round(read(daily, "temperature_2m_max", index), 1),
      temperatureMin: round(read(daily, "temperature_2m_min", index), 1)
    })),
    hours: (hourly.time || []).map((isoTime, index) => ({
      time: isoTime,
      precipitation: round(read(hourly, "precipitation", index), 2),
      precipitationProbability: round(read(hourly, "precipitation_probability", index), 0),
      temperature: round(read(hourly, "temperature_2m", index), 1),
      windSpeed: round(read(hourly, "wind_speed_10m", index), 1),
      gust: round(read(hourly, "wind_gusts_10m", index), 1),
      windDirection: round(read(hourly, "wind_direction_10m", index), 0),
      cloudCover: round(read(hourly, "cloud_cover", index), 0),
      weatherCode: read(hourly, "weather_code", index),
      weatherText: weatherText(read(hourly, "weather_code", index))
    }))
  };
}

async function fetchMarine(latitude, longitude, days) {
  const url = buildUrl("https://marine-api.open-meteo.com/v1/marine", {
    latitude,
    longitude,
    hourly: MARINE_HOURLY.join(","),
    timezone: "Asia/Seoul",
    forecast_days: days,
    cell_selection: "sea",
    length_unit: "metric",
    wind_speed_unit: "ms"
  });

  const raw = await cachedJson(url);
  const hourly = raw.hourly || {};

  return {
    status: "ok",
    source: "Open-Meteo Marine API",
    updatedAt: new Date().toISOString(),
    hours: (hourly.time || []).map((isoTime, index) => ({
      time: isoTime,
      waveHeight: round(read(hourly, "wave_height", index), 2),
      waveDirection: round(read(hourly, "wave_direction", index), 0),
      wavePeriod: round(read(hourly, "wave_period", index), 1),
      swellWaveHeight: round(read(hourly, "swell_wave_height", index), 2),
      swellWavePeriod: round(read(hourly, "swell_wave_period", index), 1),
      swellWaveDirection: round(read(hourly, "swell_wave_direction", index), 0),
      seaSurfaceTemperature: round(read(hourly, "sea_surface_temperature", index), 1),
      oceanCurrentVelocity: round(read(hourly, "ocean_current_velocity", index), 2),
      oceanCurrentDirection: round(read(hourly, "ocean_current_direction", index), 0),
      windSpeed: null,
      gust: null
    }))
  };
}

async function fetchKma(latitude, longitude, requestKey) {
  const envKey = cleanApiKey(process.env.KMA_API_KEY);
  const serviceKey = envKey || cleanApiKey(requestKey);
  const preferredProvider = cleanApiKey(process.env.KMA_API_PROVIDER).toLowerCase();
  if (!serviceKey) {
    return {
      status: "disabled",
      source: "기상청",
      message: "KMA_API_KEY 또는 앱 설정 키 없음",
      updatedAt: new Date().toISOString(),
      warnings: []
    };
  }

  const grid = latLonToKmaGrid(latitude, longitude);
  const base = latestKmaBaseTime();
  const providers = preferredProvider === "data.go.kr"
    ? ["data.go.kr", "apihub"]
    : ["apihub", "data.go.kr"];
  const forecast = await fetchKmaForecast(providers, serviceKey, grid, base);

  const items = (((forecast.raw.response || {}).body || {}).items || {}).item || [];
  const warnings = await fetchKmaWarnings(serviceKey, forecast.provider);

  return {
    status: "ok",
    source: forecast.source,
    updatedAt: new Date().toISOString(),
    keySource: envKey ? "server" : "browser",
    provider: forecast.provider,
    baseDate: base.date,
    baseTime: base.time,
    grid,
    hours: normalizeKmaItems(Array.isArray(items) ? items : [items]),
    warnings
  };
}

async function fetchKmaForecast(providers, serviceKey, grid, base) {
  const errors = [];

  for (const provider of providers) {
    try {
      const raw = await cachedJson(kmaForecastUrl(provider, serviceKey, grid, base), CACHE_TTL_MS, { Accept: "application/json" });
      const header = raw.response?.header || {};
      if (header.resultCode && header.resultCode !== "00") {
        throw new Error(header.resultMsg || "기상청 단기예보 응답 오류");
      }

      return {
        raw,
        provider,
        source: provider === "apihub" ? "기상청 API허브 단기예보" : "기상청 공공데이터 단기예보"
      };
    } catch (error) {
      errors.push(`${provider}: ${error.message}`);
    }
  }

  const combined = errors.join(" / ");
  if (combined.includes("활용신청")) {
    throw new Error("기상청 API허브 키는 들어갔지만 단기예보 API 활용신청이 필요합니다.");
  }
  if (combined.includes("401") || combined.includes("Unauthorized")) {
    throw new Error("기상청 키 인증이 실패했습니다. API허브 키인지, 공공데이터포털 서비스키인지 확인이 필요합니다.");
  }
  throw new Error(`기상청 단기예보 조회 실패 (${combined})`);
}

function kmaForecastUrl(provider, serviceKey, grid, base) {
  const encodedKey = encodeKmaKey(serviceKey);
  const params = new URLSearchParams({
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: base.date,
    base_time: base.time,
    nx: String(grid.x),
    ny: String(grid.y)
  });

  if (provider === "apihub") {
    return `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?${params}&authKey=${encodedKey}`;
  }
  return `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodedKey}&${params}`;
}

async function fetchKmaWarnings(serviceKey, provider = "data.go.kr") {
  if (provider === "apihub") return fetchKmaWarningsApihub(serviceKey);

  const params = new URLSearchParams({
    pageNo: "1",
    numOfRows: "50",
    dataType: "JSON",
    stnId: "105"
  });
  const url = `https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList?serviceKey=${encodeKmaKey(serviceKey)}&${params}`;

  try {
    const raw = await cachedJson(url, CACHE_TTL_MS, { Accept: "application/json" });
    const items = (((raw.response || {}).body || {}).items || {}).item || [];
    return (Array.isArray(items) ? items : [items]).filter(Boolean).map((item) => ({
      title: item.title || item.wrn || item.warnVar || "기상특보",
      area: item.areaName || item.stnName || item.regUp || "강원권",
      level: item.warnStress || item.wrnLvl || item.cmd || "",
      announcedAt: item.tmFc || item.announcedAt || ""
    }));
  } catch (error) {
    return [{
      title: "기상특보 조회 실패",
      area: "기상청",
      level: "확인 필요",
      announcedAt: "",
      message: error.message
    }];
  }
}

async function fetchKmaWarningsApihub(serviceKey) {
  const url = `https://apihub.kma.go.kr/api/typ01/url/wrn_now_data_new.php?fe=f&tm=&disp=1&authKey=${encodeKmaKey(serviceKey)}`;

  try {
    const text = await cachedText(url, CACHE_TTL_MS);
    return parseKmaWarningText(text);
  } catch (error) {
    return [{
      title: "기상특보 조회 실패",
      area: "기상청 API허브",
      level: "확인 필요",
      announcedAt: "",
      message: error.message
    }];
  }
}

async function fetchAccuWeather(latitude, longitude) {
  const apiKey = process.env.ACCUWEATHER_API_KEY;
  if (!apiKey) {
    return {
      status: "disabled",
      source: "AccuWeather",
      message: "ACCUWEATHER_API_KEY 없음",
      updatedAt: new Date().toISOString()
    };
  }

  const locationUrl = buildUrl("https://dataservice.accuweather.com/locations/v1/cities/geoposition/search", {
    apikey: apiKey,
    q: `${latitude},${longitude}`,
    language: "ko-kr"
  });
  const location = await cachedJson(locationUrl, 60 * 60 * 1000);
  const key = location.Key;
  if (!key) throw new Error("AccuWeather 위치 키를 찾지 못했습니다.");

  const hourlyUrl = buildUrl(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}`, {
    apikey: apiKey,
    language: "ko-kr",
    metric: "true",
    details: "true"
  });
  const hourly = await cachedJson(hourlyUrl);

  return {
    status: "ok",
    source: "AccuWeather",
    updatedAt: new Date().toISOString(),
    location: location.LocalizedName || location.EnglishName || "",
    hours: (Array.isArray(hourly) ? hourly : []).map((item) => ({
      time: item.DateTime,
      weatherText: item.IconPhrase,
      precipitationProbability: item.PrecipitationProbability ?? null,
      precipitationHours: item.PrecipitationIntensity || "",
      temperature: item.Temperature?.Value ?? null,
      realFeelTemperature: item.RealFeelTemperature?.Value ?? null,
      windSpeed: accuSpeedToMetersPerSecond(item.Wind?.Speed),
      windDirection: item.Wind?.Direction?.Localized ?? "",
      gust: accuSpeedToMetersPerSecond(item.WindGust?.Speed)
    }))
  };
}

function accuSpeedToMetersPerSecond(speed) {
  const value = Number(speed?.Value);
  if (!Number.isFinite(value)) return null;
  const unit = String(speed?.Unit || "").toLowerCase();
  if (unit === "km/h" || unit === "kmh" || unit === "kph") return round(value / 3.6, 1);
  if (unit === "mi/h" || unit === "mph") return round(value * 0.44704, 1);
  return round(value, 1);
}

async function cachedJson(url, ttl = CACHE_TTL_MS, headers = {}) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && hit.expiresAt > now) return hit.data;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 140)}`);
  }
  const data = await response.json();
  cache.set(url, { data, expiresAt: now + ttl });
  return data;
}

async function cachedText(url, ttl = CACHE_TTL_MS, headers = {}) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && hit.expiresAt > now) return hit.data;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 140)}`);
  }
  const data = await response.text();
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

function read(object, key, index) {
  const list = object[key];
  if (!Array.isArray(list)) return null;
  const value = list[index];
  return value === undefined ? null : value;
}

function round(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  const factor = 10 ** digits;
  return Math.round(Number(value) * factor) / factor;
}

function weatherText(code) {
  const value = Number(code);
  if (!Number.isFinite(value)) return "정보 없음";
  if (value === 0) return "맑음";
  if (value === 1) return "대체로 맑음";
  if (value === 2) return "부분 흐림";
  if (value === 3) return "흐림";
  if (value === 45 || value === 48) return "안개";
  if (value >= 51 && value <= 57) return "이슬비";
  if (value >= 61 && value <= 67) return "비";
  if (value >= 71 && value <= 77) return "눈";
  if (value >= 80 && value <= 82) return "소나기";
  if (value >= 85 && value <= 86) return "눈 소나기";
  if (value >= 95) return "뇌우";
  return "변동";
}

function attachLandWindToMarine(marine, models) {
  const byTime = new Map();
  for (const model of models) {
    for (const hour of model.hours) {
      if (!byTime.has(hour.time)) byTime.set(hour.time, []);
      byTime.get(hour.time).push(hour);
    }
  }

  for (const hour of marine.hours) {
    const matches = byTime.get(hour.time) || [];
    const winds = matches.map((item) => item.windSpeed).filter(isNumber);
    const gusts = matches.map((item) => item.gust).filter(isNumber);
    hour.windSpeed = winds.length ? round(avg(winds), 1) : null;
    hour.gust = gusts.length ? round(Math.max(...gusts), 1) : null;
  }
}

function normalizeKmaItems(items) {
  const grouped = new Map();
  for (const item of items) {
    const key = `${item.fcstDate}${item.fcstTime}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        time: `${formatKmaDate(item.fcstDate)}T${formatKmaTime(item.fcstTime)}`,
        rawDate: item.fcstDate,
        rawTime: item.fcstTime
      });
    }
    const target = grouped.get(key);
    const value = item.fcstValue;
    switch (item.category) {
      case "POP":
        target.precipitationProbability = Number(value);
        break;
      case "PTY":
        target.precipitationType = kmaPrecipitationType(value);
        break;
      case "PCP":
        target.precipitationText = value;
        break;
      case "TMP":
        target.temperature = Number(value);
        break;
      case "TMN":
        target.temperatureMin = Number(value);
        break;
      case "TMX":
        target.temperatureMax = Number(value);
        break;
      case "WSD":
        target.windSpeed = Number(value);
        break;
      case "VEC":
        target.windDirection = Number(value);
        break;
      case "WAV":
        target.waveHeight = Number(value);
        break;
      case "SKY":
        target.sky = kmaSky(value);
        break;
      default:
        break;
    }
  }
  return [...grouped.values()].sort((a, b) => a.time.localeCompare(b.time));
}

function kmaPrecipitationType(code) {
  const map = {
    "0": "없음",
    "1": "비",
    "2": "비 또는 눈",
    "3": "눈",
    "4": "소나기",
    "5": "빗방울",
    "6": "빗방울 또는 눈날림",
    "7": "눈날림"
  };
  return map[String(code)] || "정보 없음";
}

function kmaSky(code) {
  const map = { "1": "맑음", "3": "구름 많음", "4": "흐림" };
  return map[String(code)] || "정보 없음";
}

function encodeKmaKey(value) {
  const key = cleanApiKey(value);
  return key.includes("%") ? key : encodeURIComponent(key);
}

function parseKmaWarningText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.includes("REG_UP"))
    .map((line) => {
      const cells = line.split(",").map((cell) => cell.trim());
      if (cells.length < 8) return null;
      const area = cells[3] || cells[1] || "기상청";
      const announcedAt = cells[4] || "";
      const warning = warningName(cells[6]);
      const level = warningLevel(cells[7]);
      const command = warningCommand(cells[8]);
      return {
        title: [warning, level, command].filter(Boolean).join(" "),
        area,
        level,
        announcedAt
      };
    })
    .filter(Boolean);
}

function warningName(code) {
  return ({
    W: "강풍",
    R: "호우",
    C: "한파",
    D: "건조",
    O: "폭풍해일",
    N: "지진해일",
    V: "풍랑",
    T: "태풍",
    S: "대설",
    Y: "황사",
    H: "폭염",
    F: "안개",
    K: "열대야"
  })[String(code || "").trim()] || String(code || "").trim();
}

function warningLevel(code) {
  return ({ "1": "예비", "2": "주의보", "3": "경보" })[String(code || "").trim()] || String(code || "").trim();
}

function warningCommand(code) {
  return ({ "1": "발표", "2": "대치", "3": "해제", "4": "대치해제", "5": "연장", "6": "변경", "7": "변경해제" })[String(code || "").trim()] || "";
}

function formatKmaDate(value) {
  const text = String(value || "");
  return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
}

function formatKmaTime(value) {
  const text = String(value || "").padStart(4, "0");
  return `${text.slice(0, 2)}:${text.slice(2, 4)}`;
}

function latestKmaBaseTime() {
  const now = kstNowParts();
  const bases = ["0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"];
  const currentMinutes = now.hour * 60 + now.minute;
  let selected = null;
  for (const base of bases) {
    const baseMinutes = Number(base.slice(0, 2)) * 60 + 20;
    if (currentMinutes >= baseMinutes) selected = base;
  }

  if (selected) {
    return { date: `${now.year}${now.month}${now.day}`, time: selected };
  }

  const yesterday = new Date(Date.UTC(Number(now.year), Number(now.month) - 1, Number(now.day)) - 24 * 60 * 60 * 1000);
  return {
    date: `${yesterday.getUTCFullYear()}${pad2(yesterday.getUTCMonth() + 1)}${pad2(yesterday.getUTCDate())}`,
    time: "2300"
  };
}

function kstNowParts() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return {
    year: String(kst.getUTCFullYear()),
    month: pad2(kst.getUTCMonth() + 1),
    day: pad2(kst.getUTCDate()),
    hour: kst.getUTCHours(),
    minute: kst.getUTCMinutes()
  };
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function latLonToKmaGrid(latitude, longitude) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;
  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + latitude * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = longitude * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    x: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    y: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
  };
}

function avg(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
