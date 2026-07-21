const CONFIG = {
  timezone: "Asia/Seoul",
  thresholds: {
    rainMm: 0.1,
    rainProbability: 55,
    strongRainMm: 3,
    cautionWind: 6,
    holdWind: 9,
    cautionGust: 9,
    holdGust: 13,
    cautionWave: 0.8,
    holdWave: 1.2,
    maxRecommendationHours: 4,
    minRecommendationHours: 2,
    initialSourceRows: 18
  },
  colors: {
    blue: "#7fb3ff",
    yellow: "#ffd166",
    ecmwf: "#7fb3ff",
    gfs: "#4db6ac",
    icon: "#ffd166",
    marine: "#f49d5b",
    red: "#ff6b6b"
  }
};

const SOURCE_DESCRIPTIONS = {
  kma: "KMA는 대한민국 기상청 공식 단기예보입니다. 국내 행정/격자 예보와 특보 확인에 가장 직접적인 기준으로 봅니다.",
  ecmwf: "ECMWF는 유럽중기예보센터 수치예보 모델입니다. 전 지구 예측에서 안정성이 좋아 중기 흐름 확인에 자주 씁니다.",
  gfs: "GFS는 미국 NOAA/NCEP의 전 지구 예보 모델입니다. 갱신이 빠르고 널리 공개되어 비교 기준으로 좋습니다.",
  icon: "ICON은 독일 기상청 DWD의 수치예보 모델입니다. 유럽권 중심으로 강하지만 전 지구 예보도 제공됩니다.",
  accuweather: "민간 예보는 자체 보정과 서비스 모델을 섞은 상용 예보입니다. 공식/수치모델과 차이가 나는지 참고용으로 봅니다.",
  marine: "바다 탭은 해상 격자의 파고, 너울, 파주기, 수온을 보여줍니다. 해수욕 전에는 육상 예보와 함께 봐야 합니다."
};

const DEFAULT_PLACES_VERSION = "2026-07-east-coast-beaches-v1";
const DEFAULT_PLACES = [
  defaultBeach("goseong-myeongpa", "고성", "명파해수욕장", 38.5430, 128.4085),
  defaultBeach("machajin", "고성", "마차진해수욕장", 38.5109306, 128.4198944),
  defaultBeach("daejin1", "고성", "대진1리해수욕장", 38.5041175, 128.4249022),
  defaultBeach("goseong-daejin5", "고성", "대진5리해수욕장", 38.4956850, 128.4270550),
  defaultBeach("goseong-chodo", "고성", "초도해수욕장", 38.4855300, 128.4320000),
  defaultBeach("goseong-hwajinpo-hyeonnae", "고성", "화진포해수욕장(현내)", 38.4813000, 128.4380000),
  defaultBeach("hwajinpo", "고성", "화진포해수욕장(거진)", 38.4762000, 128.4389000),
  defaultBeach("goseong-geojin1", "고성", "거진1리해수욕장", 38.4480190, 128.4645420),
  defaultBeach("goseong-geojin11", "고성", "거진11리해수욕장", 38.4413430, 128.4530420),
  defaultBeach("goseong-banam", "고성", "반암해수욕장", 38.4202310, 128.4640670),
  defaultBeach("goseong-gajin", "고성", "가진해수욕장", 38.3738929, 128.5091656),
  defaultBeach("gonghyeonjin1", "고성", "공현진1리해수욕장", 38.3585830, 128.5085337),
  defaultBeach("goseong-gonghyeonjin2", "고성", "공현진2리해수욕장", 38.3540000, 128.5100000),
  defaultBeach("goseong-songjiho", "고성", "송지호해수욕장", 38.3397414, 128.5183328),
  defaultBeach("goseong-songjiho-camp", "고성", "송지호오토캠핑장해수욕장", 38.3345000, 128.5220000),
  defaultBeach("goseong-bongsudae", "고성", "봉수대해수욕장", 38.3231843, 128.5274240),
  defaultBeach("goseong-sampo", "고성", "삼포해수욕장", 38.3151120, 128.5350707),
  defaultBeach("goseong-sampo2", "고성", "삼포2리해수욕장", 38.3122000, 128.5390000),
  defaultBeach("goseong-jajakdo", "고성", "자작도해수욕장", 38.3085803, 128.5430576),
  defaultBeach("goseong-jajakdo-camp", "고성", "자작도캠핑장해수욕장", 38.3075000, 128.5438000),
  defaultBeach("goseong-baekdo", "고성", "백도해수욕장", 38.2998786, 128.5469193),
  defaultBeach("goseong-munamjin2", "고성", "문암진2리해수욕장", 38.2969836, 128.5482010),
  defaultBeach("goseong-gyoam", "고성", "교암해수욕장", 38.2926944, 128.5480594),
  defaultBeach("ayajin", "고성", "아야진해수욕장", 38.2759389, 128.5534139),
  defaultBeach("goseong-cheonggan", "고성", "청간해수욕장", 38.2677223, 128.5573050),
  defaultBeach("cheonjin", "고성", "천진해수욕장", 38.2576417, 128.5603917),
  defaultBeach("goseong-bongpo", "고성", "봉포해수욕장", 38.2544652, 128.5635914),
  defaultBeach("goseong-kensington", "고성", "켄싱턴리조트해수욕장", 38.2490000, 128.5660000),

  defaultBeach("sokcho-lighthouse", "속초", "등대해수욕장", 38.2154000, 128.6007000),
  defaultBeach("sokcho-cheongho", "속초", "청호해수욕장", 38.2039399, 128.5951991),
  defaultBeach("sokcho-main", "속초", "속초해수욕장", 38.1880319, 128.6061423),
  defaultBeach("sokcho-oeongchi", "속초", "외옹치해수욕장", 38.1836279, 128.6089723),

  defaultBeach("samcheok-jeungsan", "삼척", "증산해수욕장", 37.4743735, 129.1621189),
  defaultBeach("samcheok-jageunhujin", "삼척", "작은후진해수욕장", 37.4721000, 129.1675000),
  defaultBeach("samcheok-main", "삼척", "삼척해수욕장", 37.4682253, 129.1695800),
  defaultBeach("samcheok-obun", "삼척", "오분해수욕장", 37.4400000, 129.1950000),
  defaultBeach("samcheok-hanjaemit", "삼척", "한재밑해수욕장", 37.4084958, 129.2053505),
  defaultBeach("samcheok-sangmaengbang", "삼척", "상맹방해수욕장", 37.4032408, 129.2116069),
  defaultBeach("samcheok-maengbang", "삼척", "맹방해수욕장", 37.3980000, 129.2220000),
  defaultBeach("samcheok-hamaengbang", "삼척", "하맹방해수욕장", 37.3905501, 129.2314907),
  defaultBeach("samcheok-deoksan", "삼척", "덕산해수욕장", 37.3838083, 129.2454897),
  defaultBeach("samcheok-bunam", "삼척", "부남해수욕장", 37.3624357, 129.2513058),
  defaultBeach("samcheok-gungchon", "삼척", "궁촌해수욕장", 37.3268000, 129.2702000),
  defaultBeach("samcheok-wonpyeong", "삼척", "원평해수욕장", 37.3196228, 129.2724870),
  defaultBeach("samcheok-munam", "삼척", "문암해수욕장", 37.3090605, 129.2890802),
  defaultBeach("samcheok-yonghwa", "삼척", "용화해수욕장", 37.2912335, 129.3041079),
  defaultBeach("samcheok-jangho", "삼척", "장호해수욕장", 37.2861867, 129.3123394),
  defaultBeach("samcheok-imwon", "삼척", "임원해수욕장", 37.2266924, 129.3414379)
];

function defaultBeach(id, region, beachName, latitude, longitude) {
  return {
    id,
    name: `${region} - ${beachName}`,
    shortName: beachName,
    region,
    latitude,
    longitude,
    source: "강원특별자치도·시군 해수욕장 목록"
  };
}

const STORAGE = {
  favorites: "coastForecast:favorites",
  defaultPlacesVersion: "coastForecast:defaultPlacesVersion",
  lastPlaceId: "coastForecast:lastPlaceId",
  lastDate: "coastForecast:lastDate",
  lastStartDate: "coastForecast:lastStartDate",
  lastEndDate: "coastForecast:lastEndDate",
  kmaApiKey: "coastForecast:kmaApiKey",
  snapshotPrefix: "coastForecast:snapshot:"
};

const state = {
  favorites: [],
  currentPlace: null,
  startDate: todayKst(),
  endDate: todayKst(),
  kmaApiKey: "",
  forecast: null,
  previousSnapshot: null,
  map: null,
  markers: [],
  mapClickMarker: null,
  activeTab: "summary",
  activeSource: "all",
  expandedSources: new Set(["ecmwf"]),
  searchRequestId: 0,
  searchTimer: null,
  loading: false
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindElements();
  if (window.location.protocol === "file:") {
    renderFileProtocolWarning();
    renderIcons();
    return;
  }

  state.favorites = loadFavorites();
  state.kmaApiKey = loadKmaApiKey();
  state.startDate = localStorage.getItem(STORAGE.lastStartDate) || localStorage.getItem(STORAGE.lastDate) || todayKst();
  state.endDate = localStorage.getItem(STORAGE.lastEndDate) || state.startDate;
  state.currentPlace = findInitialPlace();

  renderPlaceOptions();
  els.startDateInput.value = state.startDate;
  els.endDateInput.value = state.endDate;
  bindEvents();
  initMap();
  renderIcons();

  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  if (!isLocalhost && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }

  await refreshForecast();
}

function renderFileProtocolWarning() {
  showLoading(false);
  document.querySelector("main").innerHTML = `
    <section class="protocol-warning">
      <h2>서버 주소로 열어야 합니다</h2>
      <p>
        지금은 파일을 직접 연 상태라 예보 API와 PWA 캐시가 정상 동작하지 않습니다.
        로컬 서버가 켜져 있으면 아래 주소로 열어주세요.
      </p>
      <p><strong>http://localhost:3000/</strong></p>
    </section>
  `;
  els.lastUpdated.textContent = "파일 직접 열림";
  els.sourceStatus.textContent = "API 사용 불가";
}

function bindElements() {
  [
    "refreshButton",
    "alertBanner",
    "placePicker",
    "startDateInput",
    "endDateInput",
    "locateButton",
    "quickFavoriteButton",
    "searchForm",
    "searchInput",
    "searchResults",
    "lastUpdated",
    "sourceStatus",
    "loadingState",
    "selectedPlaceName",
    "summaryTitle",
    "summaryText",
    "summaryBadge",
    "summaryMetrics",
    "recommendationCard",
    "sourceHourlyList",
    "consensusCard",
    "modelTable",
    "precipChart",
    "windChart",
    "temperatureChart",
    "marineSummary",
    "marineHours",
    "marineChart",
    "changeCard",
    "favoriteList",
    "serviceCards",
    "kmaApiKeyInput",
    "saveKmaKeyButton",
    "clearKmaKeyButton",
    "kmaKeyState",
    "addFavoriteButton",
    "addMapPointButton",
    "map",
    "toast"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.refreshButton.addEventListener("click", refreshForecast);
  els.startDateInput.addEventListener("change", handleRangeChange);
  els.endDateInput.addEventListener("change", handleRangeChange);
  els.saveKmaKeyButton.addEventListener("click", saveKmaApiKey);
  els.clearKmaKeyButton.addEventListener("click", clearKmaApiKey);

  els.locateButton.addEventListener("click", useCurrentLocation);
  els.quickFavoriteButton.addEventListener("click", () => addFavorite(state.currentPlace));
  els.searchForm.addEventListener("submit", searchPlaces);
  els.searchInput.addEventListener("focus", showFavoriteSuggestions);
  els.searchInput.addEventListener("input", handleSearchInput);
  els.placePicker.addEventListener("keydown", handlePlacePickerKeydown);
  document.addEventListener("pointerdown", (event) => {
    if (!els.placePicker.contains(event.target)) closeSearchResults({ restoreValue: true });
  });
  els.addFavoriteButton.addEventListener("click", () => addFavorite(state.currentPlace));
  els.addMapPointButton.addEventListener("click", () => {
    if (!state.map) return;
    const center = state.map.getCenter();
    selectPlace({
      id: `map-${center.lat.toFixed(5)}-${center.lng.toFixed(5)}`,
      name: "지도 선택 위치",
      latitude: Number(center.lat.toFixed(6)),
      longitude: Number(center.lng.toFixed(6)),
      source: "지도 중심"
    });
    addFavorite(state.currentPlace);
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });
}

function handleRangeChange() {
  state.startDate = els.startDateInput.value || state.startDate;
  state.endDate = els.endDateInput.value || state.startDate;
  if (state.endDate < state.startDate) state.endDate = state.startDate;
  els.startDateInput.value = state.startDate;
  els.endDateInput.value = state.endDate;
  saveDateRange();
  state.previousSnapshot = loadPreviousSnapshot();
  renderAll();
  storeCurrentSnapshot();
}

async function refreshForecast() {
  if (!state.currentPlace || state.loading) return;

  state.loading = true;
  showLoading(true);
  state.previousSnapshot = loadPreviousSnapshot();
  renderPlaceOptions();
  updateMap();

  try {
    const url = new URL("/api/forecast", window.location.origin);
    url.searchParams.set("lat", state.currentPlace.latitude);
    url.searchParams.set("lon", state.currentPlace.longitude);
    url.searchParams.set("name", state.currentPlace.name);
    url.searchParams.set("days", "10");

    const headers = {};
    if (state.kmaApiKey) headers["x-kma-api-key"] = state.kmaApiKey;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "예보를 불러오지 못했습니다.");
    }

    state.forecast = await response.json();
    syncDateWithForecast();
    renderAll();
    storeCurrentSnapshot();
  } catch (error) {
    showToast(error.message || "예보 조회 중 오류가 발생했습니다.");
    renderError(error);
  } finally {
    state.loading = false;
    showLoading(false);
    renderIcons();
  }
}

function renderAll() {
  if (!state.forecast) return;
  const analysis = analyzeSelectedDate();

  renderTopMeta(analysis);
  renderAlertBanner();
  renderSourceHourlyView();
  renderSummary(analysis);
  renderActiveTab(analysis);
  updateMap();
  renderIcons();
}

function renderActiveTab(analysis = analyzeSelectedDate()) {
  if (state.activeTab === "models") renderModelsView(analysis);
  if (state.activeTab === "marine") renderMarineView(analysis);
  if (state.activeTab === "changes") renderChangesView();
  if (state.activeTab === "settings") renderSettingsView();
}

function renderTopMeta(analysis) {
  els.selectedPlaceName.textContent = state.currentPlace.name;
  els.lastUpdated.textContent = `마지막 갱신 ${formatDateTime(state.forecast.generatedAt)}`;
  const available = [
    serviceLabel("모델", state.forecast.models),
    serviceLabel("바다", state.forecast.marine),
    serviceLabel("기상청", state.forecast.kma),
    serviceLabel("아큐웨더", state.forecast.accuweather)
  ];
  els.sourceStatus.textContent = available.join(" · ");
  els.summaryBadge.textContent = analysis.recommendation.status;
  els.summaryBadge.className = `status-badge ${statusClass(analysis.recommendation.status)}`;
}

function renderAlertBanner() {
  const warnings = activeWarnings();
  if (!warnings.length) {
    els.alertBanner.classList.add("is-hidden");
    els.alertBanner.textContent = "";
    return;
  }

  els.alertBanner.classList.remove("is-hidden");
  els.alertBanner.innerHTML = `
    <i data-lucide="triangle-alert"></i>
    <div>
      <div>기상특보 확인 필요</div>
      <small>${warnings.map((item) => escapeHtml(item.title || "기상특보")).join(" · ")}</small>
    </div>
  `;
}

function renderSummary(analysis) {
  els.summaryTitle.textContent = `${formatDateRangeLabel()} · ${analysis.consensus.label}`;
  els.summaryText.textContent = analysis.summaryLine;

  els.summaryMetrics.innerHTML = [
    metricHtml("모델 합의도", `${analysis.consensus.percent}%`, analysis.consensus.shortReason),
    metricHtml("비 가능 시간", analysis.rainWindow || "뚜렷한 시간 없음", `${analysis.rainModelPeak}개 모델 강수 신호`),
    metricHtml("바람·돌풍", `최대 ${fmt(analysis.maxGust, 1)}m/s`, `평균 풍속 ${fmt(analysis.avgWind, 1)}m/s`),
    metricHtml("파고", analysis.maxWave === null ? "자료 없음" : `최대 ${fmt(analysis.maxWave, 2)}m`, "Open-Meteo Marine")
  ].join("");

  els.recommendationCard.innerHTML = `
    <div class="card-title-row">
      <div>
        <h3>물놀이 시간 판단</h3>
        <p class="muted">2~4시간 단위로 강수·바람·돌풍·파고를 함께 봅니다.</p>
      </div>
      <span class="status-badge ${statusClass(analysis.recommendation.status)}">${analysis.recommendation.status}</span>
    </div>
    <p><strong>${analysis.recommendation.window}</strong></p>
    <div class="pill-row">
      ${analysis.recommendation.reasons.map((reason) => `<span class="pill">${escapeHtml(reason)}</span>`).join("")}
    </div>
  `;
}

function renderSourceHourlyView() {
  const sources = buildHourlySources();
  const tabs = buildSourceTabs(sources);
  if (!tabs.some((source) => source.id === state.activeSource)) {
    state.activeSource = "all";
  }
  const active = tabs.find((source) => source.id === state.activeSource) || tabs[0];
  const activeContent = state.activeSource === "all"
    ? allSourcesContent(sources)
    : singleSourceContent(active);

  els.sourceHourlyList.innerHTML = `
    <section class="weather-console">
      <div class="console-head">
        <div>
          <p class="eyebrow">시간별 예보</p>
          <h2>${escapeHtml(active.title)}</h2>
          <p class="muted">${escapeHtml(active.subtitle)}</p>
        </div>
        <span class="source-pill">${escapeHtml(formatDateRangeLabel())}</span>
      </div>
      <div class="model-tabs" role="tablist" aria-label="예보 출처 선택">
        ${tabs.map((source) => `
          <button class="model-tab ${source.id === state.activeSource ? "is-active" : ""} ${source.available ? "" : "is-disabled"}" type="button" data-source-tab="${escapeAttribute(source.id)}" title="${escapeAttribute(source.description || "")}">
            <i data-lucide="${source.icon}"></i>
            <span>${escapeHtml(source.label)}</span>
            ${source.description ? `<span class="tab-help" aria-hidden="true" title="${escapeAttribute(source.description)}">?</span>` : ""}
          </button>
        `).join("")}
      </div>
      <div class="forecast-period-legend" aria-label="시간대 구분">
        <span class="period-key is-swim"><i data-lucide="sun"></i>09:00~17:59 물놀이 중심</span>
        <span class="period-key is-reference"><i data-lucide="moon"></i>18:00~08:59 참고</span>
      </div>
      ${activeContent}
    </section>
  `;

  els.sourceHourlyList.querySelectorAll("[data-source-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSource = button.dataset.sourceTab;
      renderSourceHourlyView();
      renderIcons();
    });
  });
  const rails = [...els.sourceHourlyList.querySelectorAll(".forecast-rail")];
  rails.forEach(bindHorizontalDrag);
  if (state.activeSource === "all") bindUnifiedCompareScroll(els.sourceHourlyList);
}

function buildSourceTabs(sources) {
  return [
    {
      id: "all",
      kind: "all",
      label: "전체보기",
      title: "전체보기",
      subtitle: "사용 가능한 예보를 세로로 비교",
      icon: "columns-3",
      description: "전체보기는 현재 조회 가능한 예보 출처를 한 화면에 세로로 쌓아 시간대별 차이를 빠르게 비교합니다.",
      available: sources.some((source) => source.available),
      hours: []
    },
    ...sources
  ];
}

function allSourcesContent(sources) {
  const availableSources = sources.filter((source) => source.id !== "marine" && source.available && source.hours.length > 0);
  if (!availableSources.length) {
    return `<div class="source-empty">선택 기간에 비교할 수 있는 시간별 예보가 없습니다.</div>`;
  }

  return `
    <div class="compare-stack">
      ${availableSources.map((source) => sourceCompareSection(source)).join("")}
    </div>
    <div class="compare-master-scroll" aria-label="전체보기 시간대 스크롤">
      <div class="compare-master-track"></div>
    </div>
  `;
}

function singleSourceContent(source) {
  if (!source.available) return `<div class="source-empty">${escapeHtml(source.message)}</div>`;
  return `
    <div class="forecast-rail" aria-label="${escapeAttribute(source.title)} 시간별 예보">
      ${source.hours.map((hour) => forecastTile(hour, source.kind)).join("")}
    </div>
  `;
}

function sourceCompareSection(source) {
  return `
    <section class="compare-section">
      <div class="compare-head">
        <div>
          <h3>${escapeHtml(source.title)}</h3>
          <p class="muted">${escapeHtml(source.subtitle)}</p>
        </div>
        <span class="source-pill">${escapeHtml(source.label)}</span>
      </div>
      <div class="forecast-rail" aria-label="${escapeAttribute(source.title)} 시간별 예보">
        ${source.hours.map((hour) => forecastTile(hour, source.kind, true)).join("")}
      </div>
    </section>
  `;
}

function buildHourlySources() {
  const marineByTime = marineHourMap();
  const modelSources = modelHoursForDate().map((model) => ({
    id: model.id,
    kind: "model",
    label: model.label,
    title: `${model.label} 수치모델`,
    subtitle: `Open-Meteo · ${model.sourceModel}`,
    icon: modelIcon(model.id),
    description: SOURCE_DESCRIPTIONS[model.id],
    available: model.hours.length > 0,
    message: `${model.label}의 선택 기간 시간별 자료가 없습니다.`,
    hours: model.hours.map((hour) => ({
      time: hour.time,
      icon: weatherIcon(hour),
      status: hour.weatherText || "정보 없음",
      primary: `${fmt(hour.temperature, 1)}℃`,
      secondary: `${fmt(hour.precipitation, 1)}mm`,
      metrics: [
        ["확률", `${fmt(hour.precipitationProbability, 0)}%`],
        ["풍속", `${fmt(hour.windSpeed, 1)}m/s`],
        ["돌풍", `${fmt(hour.gust, 1)}m/s`],
        ["구름", `${fmt(hour.cloudCover, 0)}%`],
        ["파도", waveMetric(hour, marineByTime)]
      ]
    }))
  }));

  return [
    buildKmaSource(),
    ...modelSources,
    buildAccuWeatherSource(),
    buildMarineSource()
  ];
}

function buildKmaSource() {
  const kma = state.forecast.kma;
  if (!kma || kma.status === "disabled") {
    return disabledSource("kma", "KMA", "기상청 공식예보", "키 없음", "cloud-sun", "설정에서 기상청 키를 저장하면 공식 시간별 예보와 특보가 표시됩니다.");
  }
  if (kma.status === "error") {
    return disabledSource("kma", "KMA", "기상청 공식예보", "조회 오류", "triangle-alert", kma.message);
  }

  const hours = (kma.hours || []).filter((hour) => dateInSelectedRange(hour.time));
  const marineByTime = marineHourMap();
  return {
    id: "kma",
    kind: "kma",
    label: "KMA",
    title: "기상청 공식예보",
    subtitle: `단기예보 · 발표 ${formatKmaIssued(kma.baseDate, kma.baseTime)}`,
    icon: "cloud-sun",
    description: SOURCE_DESCRIPTIONS.kma,
    available: hours.length > 0,
    message: "선택 기간에 기상청 시간별 자료가 없습니다.",
    hours: hours.map((hour) => ({
      time: hour.time,
      icon: kmaIcon(hour),
      status: [hour.sky, hour.precipitationType && hour.precipitationType !== "없음" ? hour.precipitationType : ""].filter(Boolean).join(" · ") || "정보 없음",
      primary: `${fmt(hour.temperature, 1)}℃`,
      secondary: `${fmt(hour.precipitationProbability, 0)}%`,
      metrics: [
        ["확률", `${fmt(hour.precipitationProbability, 0)}%`],
        ["풍속", `${fmt(hour.windSpeed, 1)}m/s`],
        ["돌풍", "-"],
        ["구름", hour.sky || "-"],
        ["파도", waveMetric(hour, marineByTime)]
      ]
    }))
  };
}

function buildAccuWeatherSource() {
  const accuweather = state.forecast.accuweather;
  if (!accuweather || accuweather.status === "disabled") {
    return disabledSource("accuweather", "민간", "AccuWeather", "API 키 없음", "info", "ACCUWEATHER_API_KEY 등록 시 민간 시간별 예보가 표시됩니다.");
  }
  if (accuweather.status === "error") {
    return disabledSource("accuweather", "민간", "AccuWeather", "조회 오류", "triangle-alert", accuweather.message);
  }

  const hours = (accuweather.hours || []).filter((hour) => dateInSelectedRange(hour.time));
  const marineByTime = marineHourMap();
  return {
    id: "accuweather",
    kind: "accuweather",
    label: "민간",
    title: "AccuWeather",
    subtitle: accuweather.location || "시간별 예보",
    icon: "info",
    description: SOURCE_DESCRIPTIONS.accuweather,
    available: hours.length > 0,
    message: "선택 기간에 AccuWeather 시간별 자료가 없습니다.",
    hours: hours.map((hour) => ({
      time: hour.time,
      icon: accuweatherIcon(hour),
      status: hour.weatherText || "정보 없음",
      primary: `${fmt(hour.temperature, 1)}℃`,
      secondary: `${fmt(hour.precipitationProbability, 0)}%`,
      metrics: [
        ["확률", `${fmt(hour.precipitationProbability, 0)}%`],
        ["풍속", `${fmt(hour.windSpeed, 1)}m/s`],
        ["돌풍", `${fmt(hour.gust, 1)}m/s`],
        ["구름", "-"],
        ["파도", waveMetric(hour, marineByTime)]
      ]
    }))
  };
}

function buildMarineSource() {
  const marine = marineHoursForDate();
  return {
    id: "marine",
    kind: "marine",
    label: "바다",
    title: "해양예보",
    subtitle: "Open-Meteo Marine · 해상 격자 우선",
    icon: "waves",
    description: SOURCE_DESCRIPTIONS.marine,
    available: marine.length > 0,
    message: "선택 기간에 해양 시간별 자료가 없습니다.",
    hours: marine.map((hour) => ({
      time: hour.time,
      icon: marineIcon(hour),
      status: `${directionText(hour.waveDirection)} · 파주기 ${fmt(hour.wavePeriod, 1)}초`,
      primary: `${fmt(hour.waveHeight, 2)}m`,
      secondary: `${fmt(hour.seaSurfaceTemperature, 1)}℃`,
      metrics: [
        ["확률", "-"],
        ["풍속", `${fmt(hour.windSpeed, 1)}m/s`],
        ["돌풍", `${fmt(hour.gust, 1)}m/s`],
        ["구름", "-"],
        ["파도", `${fmt(hour.waveHeight, 2)}m`]
      ]
    }))
  };
}

function marineHourMap() {
  return new Map(marineHoursForDate().map((hour) => [hour.time, hour]));
}

function waveMetric(hour, marineByTime) {
  const wave = hour.waveHeight ?? marineByTime.get(hour.time)?.waveHeight;
  return Number.isFinite(Number(wave)) ? `${fmt(wave, 2)}m` : "-";
}

function disabledSource(id, label, title, subtitle, icon, message) {
  return { id, kind: id, label, title, subtitle, icon, description: SOURCE_DESCRIPTIONS[id], available: false, message, hours: [] };
}

function forecastTile(hour, kind, compact = false) {
  if (compact) return compactForecastTile(hour, kind);

  const weatherClass = `weather-${weatherTone(hour.icon, kind)}`;
  const period = forecastPeriod(hour.time);

  return `
    <article class="forecast-tile ${weatherClass} ${period.className} ${period.isStart ? "is-period-start" : ""} ${kind === "marine" ? "is-marine" : ""} ${compact ? "is-compact" : ""}">
      <div class="tile-time" title="${period.label}"><i class="time-period-icon" data-lucide="${period.icon}"></i><span>${formatTableTime(hour.time)}</span></div>
      <div class="tile-icon weather-glyph" title="${escapeAttribute(hour.status)}"><i data-lucide="${hour.icon}"></i></div>
      <strong>${escapeHtml(hour.primary)}</strong>
      <span>${escapeHtml(hour.secondary)}</span>
      <small>${escapeHtml(hour.status)}</small>
      <dl>
        ${hour.metrics.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}
      </dl>
    </article>
  `;
}

function compactForecastTile(hour, kind) {
  const weatherClass = `weather-${weatherTone(hour.icon, kind)}`;
  const period = forecastPeriod(hour.time);

  return `
    <article class="forecast-tile is-compact ${weatherClass} ${period.className} ${period.isStart ? "is-period-start" : ""} ${kind === "marine" ? "is-marine" : ""}">
      <div class="compact-top">
        <div class="compact-time" title="${period.label}"><i class="time-period-icon" data-lucide="${period.icon}"></i><span>${formatTableTime(hour.time)}</span></div>
        <span class="weather-glyph" title="${escapeAttribute(hour.status)}"><i data-lucide="${hour.icon}"></i></span>
      </div>
      <div class="compact-main">
        <strong>${escapeHtml(hour.primary)}</strong>
        <span>${escapeHtml(hour.secondary)}</span>
      </div>
      <small title="${escapeAttribute(hour.status)}">${escapeHtml(hour.status)}</small>
      <dl>
        ${hour.metrics.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}
      </dl>
    </article>
  `;
}

function sourceKmaCard() {
  const kma = state.forecast.kma;
  if (!kma || kma.status === "disabled") {
    return sourceDisabledCard("기상청 공식예보", "키 없음", "설정에서 기상청 키를 저장하면 공식 시간별 예보와 특보가 표시됩니다.");
  }
  if (kma.status === "error") {
    return sourceDisabledCard("기상청 공식예보", "조회 오류", kma.message);
  }

  const hours = (kma.hours || []).filter((hour) => dateInSelectedRange(hour.time));
  const visibleHours = state.expandedSources.has("kma") ? hours : hours.slice(0, CONFIG.thresholds.initialSourceRows);
  const rows = visibleHours.map((hour) => `
    <tr>
      <td>${formatTableTime(hour.time)}</td>
      <td>${escapeHtml(hour.sky || "정보 없음")}</td>
      <td>${escapeHtml(hour.precipitationType || "없음")}</td>
      <td>${fmt(hour.precipitationProbability, 0)}%</td>
      <td>${fmt(hour.temperature, 1)}℃</td>
      <td>${fmt(hour.windSpeed, 1)}m/s</td>
    </tr>
  `).join("");

  return sourceTableCard({
    id: "kma",
    title: "기상청 공식예보",
    badge: "KMA",
    subtitle: `단기예보 · 발표 ${formatKmaIssued(kma.baseDate, kma.baseTime)}`,
    empty: "선택 기간에 기상청 시간별 자료가 없습니다.",
    rows,
    totalRows: hours.length,
    header: "<th>시간</th><th>하늘</th><th>강수형태</th><th>강수확률</th><th>기온</th><th>풍속</th>"
  });
}

function sourceModelCard(model) {
  const visibleHours = state.expandedSources.has(model.id) ? model.hours : model.hours.slice(0, CONFIG.thresholds.initialSourceRows);
  const rows = visibleHours.map((hour) => `
    <tr>
      <td>${formatTableTime(hour.time)}</td>
      <td>${fmt(hour.precipitation, 1)}mm</td>
      <td>${fmt(hour.precipitationProbability, 0)}%</td>
      <td>${fmt(hour.temperature, 1)}℃</td>
      <td>${fmt(hour.windSpeed, 1)}m/s</td>
      <td>${fmt(hour.gust, 1)}m/s</td>
      <td>${fmt(hour.cloudCover, 0)}%</td>
      <td>${escapeHtml(hour.weatherText || "정보 없음")}</td>
    </tr>
  `).join("");

  return sourceTableCard({
    id: model.id,
    title: `${model.label} 수치모델`,
    badge: model.label,
    subtitle: `Open-Meteo · ${model.sourceModel}`,
    empty: `${model.label}의 선택 기간 시간별 자료가 없습니다.`,
    rows,
    totalRows: model.hours.length,
    header: "<th>시간</th><th>강수</th><th>확률</th><th>기온</th><th>풍속</th><th>돌풍</th><th>구름</th><th>상태</th>"
  });
}

function sourceAccuWeatherCard() {
  const accuweather = state.forecast.accuweather;
  if (!accuweather || accuweather.status === "disabled") {
    return sourceDisabledCard("AccuWeather", "API 키 없음", "ACCUWEATHER_API_KEY 등록 시 민간 시간별 예보가 표시됩니다.");
  }
  if (accuweather.status === "error") {
    return sourceDisabledCard("AccuWeather", "조회 오류", accuweather.message);
  }

  const hours = (accuweather.hours || []).filter((hour) => dateInSelectedRange(hour.time));
  const visibleHours = state.expandedSources.has("accuweather") ? hours : hours.slice(0, CONFIG.thresholds.initialSourceRows);
  const rows = visibleHours.map((hour) => `
    <tr>
      <td>${formatTableTime(hour.time)}</td>
      <td>${escapeHtml(hour.weatherText || "정보 없음")}</td>
      <td>${fmt(hour.precipitationProbability, 0)}%</td>
      <td>${fmt(hour.temperature, 1)}℃</td>
      <td>${fmt(hour.realFeelTemperature, 1)}℃</td>
      <td>${fmt(hour.windSpeed, 1)}m/s</td>
      <td>${fmt(hour.gust, 1)}m/s</td>
    </tr>
  `).join("");

  return sourceTableCard({
    id: "accuweather",
    title: "AccuWeather",
    badge: "민간",
    subtitle: accuweather.location || "시간별 예보",
    empty: "선택 기간에 AccuWeather 시간별 자료가 없습니다.",
    rows,
    totalRows: hours.length,
    header: "<th>시간</th><th>상태</th><th>강수확률</th><th>기온</th><th>체감</th><th>바람</th><th>돌풍</th>"
  });
}

function sourceMarineCard() {
  const marine = marineHoursForDate();
  const visibleHours = state.expandedSources.has("marine") ? marine : marine.slice(0, CONFIG.thresholds.initialSourceRows);
  const rows = visibleHours.map((hour) => `
    <tr>
      <td>${formatTableTime(hour.time)}</td>
      <td>${fmt(hour.waveHeight, 2)}m</td>
      <td>${fmt(hour.wavePeriod, 1)}초</td>
      <td>${directionText(hour.waveDirection)}</td>
      <td>${fmt(hour.swellWaveHeight, 2)}m</td>
      <td>${fmt(hour.seaSurfaceTemperature, 1)}℃</td>
      <td>${fmt(hour.windSpeed, 1)}m/s</td>
      <td>${fmt(hour.gust, 1)}m/s</td>
    </tr>
  `).join("");

  return sourceTableCard({
    id: "marine",
    title: "해양예보",
    badge: "바다",
    subtitle: "Open-Meteo Marine · 해상 격자 우선",
    empty: "선택 기간에 해양 시간별 자료가 없습니다.",
    rows,
    totalRows: marine.length,
    header: "<th>시간</th><th>파고</th><th>파주기</th><th>파향</th><th>너울</th><th>수온</th><th>바람</th><th>돌풍</th>"
  });
}

function sourceDisabledCard(title, badge, message) {
  return `
    <section class="source-card">
      <div class="card-title-row">
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p class="muted">${escapeHtml(message || "")}</p>
        </div>
        <span class="source-pill">${escapeHtml(badge)}</span>
      </div>
      <div class="source-empty">이 출처는 현재 비활성 상태입니다.</div>
    </section>
  `;
}

function sourceTableCard({ id, title, badge, subtitle, empty, rows, header, totalRows = 0 }) {
  const expanded = state.expandedSources.has(id);
  const shownRows = expanded ? rows : firstTableRows(rows, CONFIG.thresholds.initialSourceRows);
  const hasMore = totalRows > CONFIG.thresholds.initialSourceRows;
  return `
    <section class="source-card">
      <div class="card-title-row">
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p class="muted">${escapeHtml(subtitle || "")}</p>
        </div>
        <div class="source-actions">
          <span class="source-pill">${escapeHtml(badge)}</span>
          ${hasMore ? `
            <button class="icon-button source-toggle" type="button" data-source-toggle="${escapeAttribute(id)}" aria-label="${expanded ? "접기" : "전체 보기"}" title="${expanded ? "접기" : "전체 보기"}">
              <i data-lucide="${expanded ? "chevron-up" : "chevron-down"}"></i>
            </button>
          ` : ""}
        </div>
      </div>
      ${rows ? `
        ${hasMore ? `<p class="muted source-note">${expanded ? `전체 ${totalRows}개 시간 표시 중` : `처음 ${CONFIG.thresholds.initialSourceRows}개 시간만 표시 중`}</p>` : ""}
        <div class="table-scroll">
          <table>
            <thead><tr>${header}</tr></thead>
            <tbody>${shownRows}</tbody>
          </table>
        </div>
      ` : `<div class="source-empty">${escapeHtml(empty)}</div>`}
    </section>
  `;
}

function firstTableRows(rows, count) {
  if (!rows) return "";
  const matches = rows.match(/<tr>[\s\S]*?<\/tr>/g) || [];
  return matches.slice(0, count).join("");
}

function renderModelsView(analysis) {
  els.consensusCard.innerHTML = `
    <div class="card-title-row">
      <div>
        <h3>모델 합의도 ${analysis.consensus.percent}%</h3>
        <p class="muted">ECMWF·GFS·ICON끼리 얼마나 비슷한지를 계산한 값입니다.</p>
      </div>
      <span class="status-badge ${consensusClass(analysis.consensus.percent)}">${analysis.consensus.label}</span>
    </div>
    <p>${escapeHtml(analysis.consensus.reason)}</p>
    <div class="pill-row">
      ${analysis.consensus.details.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}
    </div>
  `;

  renderModelTable();
  renderModelCharts();
}

function renderModelTable() {
  const models = modelHoursForDate();
  const times = commonTimes(models);

  if (!models.length || !times.length) {
    els.modelTable.innerHTML = `<p class="muted">모델 비교 데이터가 없습니다.</p>`;
    return;
  }

  els.modelTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>시간</th>
          ${models.map((model) => `<th>${model.label} 강수</th><th>${model.label} 확률</th><th>${model.label} 기온</th><th>${model.label} 돌풍</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${times.map((time) => `
          <tr>
            <td>${formatTableTime(time)}</td>
            ${models.map((model) => {
              const hour = model.hoursByTime.get(time) || {};
              return `
                <td>${fmt(hour.precipitation, 1)}mm</td>
                <td>${fmt(hour.precipitationProbability, 0)}%</td>
                <td>${fmt(hour.temperature, 1)}℃</td>
                <td>${fmt(hour.gust, 1)}m/s</td>
              `;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderModelCharts() {
  const models = modelHoursForDate();
  const series = models.map((model) => ({
    name: model.label,
    color: CONFIG.colors[model.id],
    values: model.hours.map((hour) => ({ time: hour.time, value: hour.precipitation }))
  }));
  renderLineChart(els.precipChart, series, { unit: "mm" });

  renderLineChart(els.windChart, [
    ...models.map((model) => ({
      name: `${model.label} 풍속`,
      color: CONFIG.colors[model.id],
      values: model.hours.map((hour) => ({ time: hour.time, value: hour.windSpeed }))
    })),
    ...models.map((model) => ({
      name: `${model.label} 돌풍`,
      color: CONFIG.colors.red,
      dashed: true,
      values: model.hours.map((hour) => ({ time: hour.time, value: hour.gust }))
    }))
  ], { unit: "m/s" });

  renderLineChart(els.temperatureChart, models.map((model) => ({
    name: model.label,
    color: CONFIG.colors[model.id],
    values: model.hours.map((hour) => ({ time: hour.time, value: hour.temperature }))
  })), { unit: "℃" });
}

function renderMarineView(analysis) {
  const marine = marineHoursForDate();
  if (!marine.length) {
    els.marineSummary.innerHTML = `<h3>해양 상태</h3><p class="muted">해양 예보 데이터가 없습니다.</p>`;
    els.marineHours.innerHTML = "";
    els.marineChart.innerHTML = "";
    return;
  }

  els.marineSummary.innerHTML = `
    <div class="card-title-row">
      <div>
        <h3>해양 상태</h3>
        <p class="muted">파주기는 파고·파향·해변 방향과 함께 참고하는 값입니다.</p>
      </div>
      <span class="source-pill">Open-Meteo Marine</span>
    </div>
    <section class="metric-grid">
      ${metricHtml("최대 파고", `${fmt(analysis.maxWave, 2)}m`, `너울 최대 ${fmt(analysis.maxSwell, 2)}m`)}
      ${metricHtml("파주기", `${fmt(maxValue(marine.map((h) => h.wavePeriod)), 1)}초`, "높을수록 단순 불리로 판정하지 않음")}
      ${metricHtml("수온", `${fmt(avgValue(marine.map((h) => h.seaSurfaceTemperature)), 1)}℃`, "해수면 온도")}
      ${metricHtml("돌풍", `${fmt(analysis.maxGust, 1)}m/s`, "육상 모델 돌풍 병행 표시")}
    </section>
  `;

  els.marineHours.innerHTML = marine.filter((hour) => hourNumber(hour.time) >= 6 && hourNumber(hour.time) <= 21).map((hour) => `
    <article class="hour-card">
      <strong>${formatTableTime(hour.time)}</strong>
      <dl>
        <dt>파고</dt><dd>${fmt(hour.waveHeight, 2)}m</dd>
        <dt>파주기</dt><dd>${fmt(hour.wavePeriod, 1)}초</dd>
        <dt>파향</dt><dd>${directionText(hour.waveDirection)}</dd>
        <dt>너울</dt><dd>${fmt(hour.swellWaveHeight, 2)}m</dd>
        <dt>바람</dt><dd>${fmt(hour.windSpeed, 1)}m/s</dd>
        <dt>돌풍</dt><dd>${fmt(hour.gust, 1)}m/s</dd>
        <dt>수온</dt><dd>${fmt(hour.seaSurfaceTemperature, 1)}℃</dd>
      </dl>
    </article>
  `).join("");

  renderLineChart(els.marineChart, [
    {
      name: "파고",
      color: CONFIG.colors.blue,
      values: marine.map((hour) => ({ time: hour.time, value: hour.waveHeight }))
    },
    {
      name: "파주기",
      color: CONFIG.colors.yellow,
      values: marine.map((hour) => ({ time: hour.time, value: hour.wavePeriod }))
    },
    {
      name: "바람",
      color: CONFIG.colors.gfs,
      values: marine.map((hour) => ({ time: hour.time, value: hour.windSpeed }))
    },
    {
      name: "돌풍",
      color: CONFIG.colors.red,
      dashed: true,
      values: marine.map((hour) => ({ time: hour.time, value: hour.gust }))
    },
    {
      name: "수온",
      color: CONFIG.colors.marine,
      values: marine.map((hour) => ({ time: hour.time, value: hour.seaSurfaceTemperature }))
    }
  ], { unit: "" });
}

function renderChangesView() {
  const current = createSnapshot();
  const previous = state.previousSnapshot;
  if (!previous) {
    els.changeCard.innerHTML = `
      <h3>예보 변화</h3>
      <p class="muted">이 장소와 날짜의 이전 조회 기록이 없습니다. 다음 조회부터 강수량, 비 시작시각, 파고, 돌풍 변화를 비교합니다.</p>
    `;
    return;
  }

  const changes = compareSnapshots(previous, current);
  els.changeCard.innerHTML = `
    <div class="card-title-row">
      <div>
        <h3>${changes.title}</h3>
        <p class="muted">${formatDateTime(previous.createdAt)} 조회값과 비교</p>
      </div>
      <span class="source-pill">localStorage</span>
    </div>
    <div class="service-list">
      ${changes.items.map((item) => `
        <div class="change-item">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.detail)}</small>
          </div>
          <span class="${item.className}">${escapeHtml(item.delta)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderSettingsView() {
  renderKmaKeyControls();

  els.favoriteList.innerHTML = favoriteSettingsGroups(state.favorites);

  els.favoriteList.querySelectorAll("[data-place-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      selectPlace(getPlaceById(button.dataset.placeId));
      await refreshForecast();
    });
  });

  els.favoriteList.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => removeFavorite(button.dataset.removeId));
  });

  const services = [
    ["수치모델", state.forecast?.models],
    ["해양예보", state.forecast?.marine],
    ["기상청", state.forecast?.kma],
    ["아큐웨더", state.forecast?.accuweather]
  ];
  els.serviceCards.innerHTML = services.map(([label, service]) => `
    <div class="service-item">
      <div>
        <strong>${label}</strong>
        <small>${escapeHtml(service?.source || "출처 없음")}</small>
      </div>
      <span class="${serviceStatusClass(service)}">${serviceStatusText(service)}</span>
    </div>
  `).join("");
}

function renderKmaKeyControls() {
  if (!els.kmaApiKeyInput) return;
  if (document.activeElement !== els.kmaApiKeyInput) {
    els.kmaApiKeyInput.value = state.kmaApiKey;
  }

  const service = state.forecast?.kma;
  const hasServerKey = service?.keySource === "server";
  let text = hasServerKey ? "서버 키 저장됨" : state.kmaApiKey ? "앱 키 저장됨" : "키 없음";
  let className = hasServerKey || state.kmaApiKey ? "watch-text" : "danger-text";
  if (service?.status === "ok") {
    text = service.keySource === "server" ? "서버 키 활성" : "앱 키 활성";
    className = "good-text";
  } else if (service?.status === "error" && (state.kmaApiKey || hasServerKey)) {
    text = service.message?.includes("활용신청") ? "활용신청 필요" : "키 확인 필요";
    className = "danger-text";
  }

  els.kmaKeyState.textContent = text;
  els.kmaKeyState.className = className;
}

async function saveKmaApiKey() {
  const key = (els.kmaApiKeyInput.value || "").trim();
  if (!key) {
    return clearKmaApiKey();
  }

  state.kmaApiKey = key;
  localStorage.setItem(STORAGE.kmaApiKey, key);
  showToast("기상청 키를 저장했습니다.");
  renderKmaKeyControls();
  await refreshForecast();
}

async function clearKmaApiKey() {
  state.kmaApiKey = "";
  localStorage.removeItem(STORAGE.kmaApiKey);
  if (els.kmaApiKeyInput) els.kmaApiKeyInput.value = "";
  showToast("기상청 키를 지웠습니다.");
  renderKmaKeyControls();
  await refreshForecast();
}

function analyzeSelectedDate() {
  const models = modelHoursForDate();
  const marine = marineHoursForDate();
  const consensus = calculateConsensus(models);
  const recommendation = calculateRecommendation(models, marine);
  const times = commonTimes(models);
  const rainRows = times.map((time) => {
    const matched = models.map((model) => model.hoursByTime.get(time)).filter(Boolean);
    return {
      time,
      rainModels: matched.filter(isRainSignal).length,
      maxPrecip: maxValue(matched.map((hour) => hour.precipitation))
    };
  });

  const rainy = rainRows.filter((row) => row.rainModels > 0);
  const rainWindow = rainy.length ? `${formatTableTime(rainy[0].time)}~${formatTableTime(rainy[rainy.length - 1].time)}` : "";
  const allHours = models.flatMap((model) => model.hours);
  const maxGust = maxValue(allHours.map((hour) => hour.gust));
  const avgWind = avgValue(allHours.map((hour) => hour.windSpeed));
  const maxWave = maxValue(marine.map((hour) => hour.waveHeight));
  const maxSwell = maxValue(marine.map((hour) => hour.swellWaveHeight));
  const rainModelPeak = maxValue(rainRows.map((row) => row.rainModels)) || 0;

  return {
    consensus,
    recommendation,
    rainWindow,
    rainModelPeak,
    maxGust,
    avgWind,
    maxWave,
    maxSwell,
    summaryLine: buildSummaryLine(consensus, rainWindow, maxWave, recommendation.status)
  };
}

function calculateConsensus(models) {
  if (models.length < 3) {
    return {
      percent: 0,
      label: "모델 자료 부족",
      reason: "ECMWF·GFS·ICON 세 모델을 모두 받아야 합의도를 계산합니다.",
      shortReason: "자료 부족",
      details: []
    };
  }

  const times = commonTimes(models);
  let mixedHours = 0;
  let strongSingleHours = 0;
  for (const time of times) {
    const hours = models.map((model) => model.hoursByTime.get(time)).filter(Boolean);
    const rainCount = hours.filter(isRainSignal).length;
    if (rainCount > 0 && rainCount < 3) mixedHours += 1;
    const strongCount = hours.filter((hour) => Number(hour.precipitation) >= CONFIG.thresholds.strongRainMm).length;
    if (strongCount === 1) strongSingleHours += 1;
  }

  const firstRainTimes = models.map((model) => firstRainTime(model.hours)).filter(Boolean);
  const firstRainSpan = firstRainTimes.length >= 2
    ? Math.max(...firstRainTimes.map(minutesSinceEpoch)) - Math.min(...firstRainTimes.map(minutesSinceEpoch))
    : 0;
  const totals = models.map((model) => sumValue(model.hours.map((hour) => hour.precipitation)));
  const totalRange = maxValue(totals) - minValue(totals);
  const totalMax = maxValue(totals);

  let score = 100;
  const details = [];
  const mixedRatio = times.length ? mixedHours / times.length : 1;
  if (mixedRatio > 0.15) {
    const penalty = Math.min(32, mixedRatio * 70);
    score -= penalty;
    details.push(`강수 여부가 엇갈린 시간 ${mixedHours}개`);
  }
  if (firstRainSpan >= 180) {
    score -= 18;
    details.push("강수 시작시각 차이 3시간 이상");
  }
  if (totalMax > 0 && totalRange > Math.max(4, totalMax * 0.55)) {
    score -= 18;
    details.push("모델 간 강수량 편차 큼");
  }
  if (strongSingleHours > 0) {
    score -= 14;
    details.push("한 모델만 강한 비 신호");
  }

  const percent = clamp(Math.round(score), 0, 100);
  const label = percent >= 70 ? "모델 합의 높음" : percent >= 45 ? "모델 합의 보통" : "모델 불일치 큼";
  const reason = details.length ? `주요 원인: ${details.join(", ")}` : "세 모델의 강수 여부와 시간대가 대체로 비슷합니다.";

  return {
    percent,
    label,
    reason,
    shortReason: details[0] || "강수 신호 유사",
    details: details.length ? details : ["강수 여부 유사", "시작시각 편차 작음", "강수량 편차 작음"]
  };
}

function calculateRecommendation(models, marine) {
  const warnings = activeWarnings();
  if (warnings.length) {
    return {
      status: "보류 권장",
      window: "특보 확인 전까지 입수 보류 권장",
      reasons: warnings.slice(0, 3).map((warning) => warning.title || "기상특보")
    };
  }

  const times = commonTimes(models).filter((time) => {
    const hour = hourNumber(time);
    return hour >= 9 && hour < 18;
  });

  const marineByTime = new Map(marine.map((hour) => [hour.time, hour]));
  const scored = times.map((time) => {
    const modelHours = models.map((model) => model.hoursByTime.get(time)).filter(Boolean);
    const marineHour = marineByTime.get(time) || {};
    const rainModels = modelHours.filter(isRainSignal).length;
    const thunder = modelHours.some((hour) => Number(hour.weatherCode) >= 95);
    const maxPrecip = maxValue(modelHours.map((hour) => hour.precipitation)) || 0;
    const maxGust = maxValue(modelHours.map((hour) => hour.gust)) || 0;
    const avgWind = avgValue(modelHours.map((hour) => hour.windSpeed)) || 0;
    const waveHeight = marineHour.waveHeight ?? 0;
    const reasons = [];
    let status = "양호";
    let score = 100;

    if (thunder) {
      status = "보류 권장";
      score -= 80;
      reasons.push("뇌우 신호");
    }
    if (rainModels >= 2 || maxPrecip >= CONFIG.thresholds.strongRainMm) {
      status = status === "보류 권장" ? status : "주의";
      score -= 30;
      reasons.push(`강수 모델 ${rainModels}/3`);
    }
    if (maxGust >= CONFIG.thresholds.holdGust || avgWind >= CONFIG.thresholds.holdWind) {
      status = "보류 권장";
      score -= 45;
      reasons.push("바람·돌풍 강함");
    } else if (maxGust >= CONFIG.thresholds.cautionGust || avgWind >= CONFIG.thresholds.cautionWind) {
      status = status === "양호" ? "주의" : status;
      score -= 20;
      reasons.push("돌풍 증가");
    }
    if (waveHeight >= CONFIG.thresholds.holdWave) {
      status = "보류 권장";
      score -= 45;
      reasons.push(`파고 ${fmt(waveHeight, 2)}m`);
    } else if (waveHeight >= CONFIG.thresholds.cautionWave) {
      status = status === "양호" ? "주의" : status;
      score -= 18;
      reasons.push(`파고 ${fmt(waveHeight, 2)}m`);
    }

    if (!reasons.length) {
      reasons.push(`강수 모델 ${rainModels}/3`);
      reasons.push(`파고 ${fmt(waveHeight, 2)}m`);
      reasons.push(`돌풍 ${fmt(maxGust, 1)}m/s`);
    }

    return { time, status, score, reasons, rainModels, maxGust, waveHeight };
  });

  const best = bestRecommendationWindow(scored);
  if (best) {
    return {
      status: best.status,
      window: `${best.status === "양호" ? "추천 확인 시간" : "주의 시간"} ${formatTableTime(best.start)}~${formatTableTime(addHoursIso(best.end, 1))}`,
      reasons: best.reasons
    };
  }

  return {
    status: "보류 권장",
    window: "뚜렷한 추천 시간대 없음",
    reasons: ["강수·바람·파고 중 하나 이상이 기준을 넘음"]
  };
}

function bestRecommendationWindow(scored) {
  if (!scored.length) return null;
  const candidates = [];
  for (let start = 0; start < scored.length; start += 1) {
    for (let length = CONFIG.thresholds.minRecommendationHours; length <= CONFIG.thresholds.maxRecommendationHours; length += 1) {
      const slice = scored.slice(start, start + length);
      if (slice.length !== length) continue;
      const statuses = slice.map((item) => item.status);
      const status = statuses.every((item) => item === "양호") ? "양호" : statuses.some((item) => item === "보류 권장") ? "보류 권장" : "주의";
      const avgScore = avgValue(slice.map((item) => item.score));
      candidates.push({
        status,
        score: avgScore,
        start: slice[0].time,
        end: slice[slice.length - 1].time,
        reasons: summarizeWindowReasons(slice)
      });
    }
  }

  const usable = candidates.filter((item) => item.status !== "보류 권장");
  usable.sort((a, b) => b.score - a.score || statusRank(a.status) - statusRank(b.status));
  return usable[0] || null;
}

function summarizeWindowReasons(slice) {
  const rainMax = maxValue(slice.map((item) => item.rainModels)) || 0;
  const waveMax = maxValue(slice.map((item) => item.waveHeight)) || 0;
  const gustMax = maxValue(slice.map((item) => item.maxGust)) || 0;
  return [
    `강수 모델 최대 ${rainMax}/3`,
    `파고 최대 ${fmt(waveMax, 2)}m`,
    `돌풍 최대 ${fmt(gustMax, 1)}m/s`
  ];
}

function createSnapshot() {
  if (!state.forecast) return null;
  const models = modelHoursForDate();
  const marine = marineHoursForDate();
  return {
    createdAt: new Date().toISOString(),
    placeId: state.currentPlace.id,
    range: { startDate: state.startDate, endDate: state.endDate },
    totals: Object.fromEntries(models.map((model) => [model.id, sumValue(model.hours.map((hour) => hour.precipitation))])),
    firstRain: Object.fromEntries(models.map((model) => [model.id, firstRainTime(model.hours)])),
    maxWave: maxValue(marine.map((hour) => hour.waveHeight)),
    maxGust: maxValue(models.flatMap((model) => model.hours.map((hour) => hour.gust)))
  };
}

function compareSnapshots(previous, current) {
  if (!current) return { title: "비교할 현재 예보 없음", items: [] };
  const items = [];
  for (const modelId of ["ecmwf", "gfs", "icon"]) {
    const prev = previous.totals?.[modelId] ?? 0;
    const next = current.totals?.[modelId] ?? 0;
    const delta = next - prev;
    items.push({
      title: `${modelLabel(modelId)} 강수량`,
      detail: `${fmt(prev, 1)}mm → ${fmt(next, 1)}mm`,
      delta: signed(delta, "mm"),
      className: delta <= 0 ? "good-text" : "watch-text"
    });

    const prevStart = previous.firstRain?.[modelId];
    const nextStart = current.firstRain?.[modelId];
    if (prevStart || nextStart) {
      const diff = rainStartDiff(prevStart, nextStart);
      items.push({
        title: `${modelLabel(modelId)} 비 시작`,
        detail: `${prevStart ? formatTableTime(prevStart) : "없음"} → ${nextStart ? formatTableTime(nextStart) : "없음"}`,
        delta: diff.label,
        className: diff.className
      });
    }
  }

  const waveDelta = (current.maxWave ?? 0) - (previous.maxWave ?? 0);
  items.push({
    title: "예상 파고",
    detail: `${fmt(previous.maxWave, 2)}m → ${fmt(current.maxWave, 2)}m`,
    delta: signed(waveDelta, "m"),
    className: waveDelta <= 0 ? "good-text" : "watch-text"
  });

  const gustDelta = (current.maxGust ?? 0) - (previous.maxGust ?? 0);
  items.push({
    title: "최대 돌풍",
    detail: `${fmt(previous.maxGust, 1)}m/s → ${fmt(current.maxGust, 1)}m/s`,
    delta: signed(gustDelta, "m/s"),
    className: gustDelta <= 0 ? "good-text" : "watch-text"
  });

  const improving = items.filter((item) => item.className === "good-text").length;
  const title = improving >= Math.ceil(items.length / 2) ? "이전 조회보다 좋아지는 중" : "이전 조회보다 주의 신호 증가";
  return { title, items };
}

function renderLineChart(container, series, options = {}) {
  const cleanSeries = series
    .map((item) => ({
      ...item,
      values: (item.values || []).filter((point) => Number.isFinite(Number(point.value)))
    }))
    .filter((item) => item.values.length);

  if (!cleanSeries.length) {
    container.innerHTML = `<p class="muted">그래프 데이터가 없습니다.</p>`;
    return;
  }

  const width = 720;
  const height = 190;
  const pad = { left: 40, right: 18, top: 22, bottom: 32 };
  const allValues = cleanSeries.flatMap((item) => item.values.map((point) => Number(point.value)));
  const min = Math.min(0, minValue(allValues));
  const max = Math.max(1, maxValue(allValues));
  const times = cleanSeries[0].values.map((point) => point.time);
  const x = (index) => pad.left + (index / Math.max(times.length - 1, 1)) * (width - pad.left - pad.right);
  const y = (value) => height - pad.bottom - ((Number(value) - min) / Math.max(max - min, 1)) * (height - pad.top - pad.bottom);

  const paths = cleanSeries.map((item) => {
    const d = item.values.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index).toFixed(1)} ${y(point.value).toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="${item.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" ${item.dashed ? 'stroke-dasharray="5 5"' : ""}/>`;
  }).join("");

  const labelStep = times.length > 72 ? 12 : times.length > 36 ? 6 : 3;
  const xLabels = times
    .filter((_, index) => index % labelStep === 0)
    .map((time) => {
      const index = times.indexOf(time);
      return `<text x="${x(index)}" y="${height - 9}" text-anchor="middle">${escapeSvg(formatTableTime(time))}</text>`;
    }).join("");

  const legend = cleanSeries.map((item, index) => `
    <g transform="translate(${pad.left + index * 116}, 12)">
      <line x1="0" y1="0" x2="18" y2="0" stroke="${item.color}" stroke-width="3" ${item.dashed ? 'stroke-dasharray="5 5"' : ""}/>
      <text x="24" y="4">${escapeSvg(item.name)}</text>
    </g>
  `).join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="시간별 그래프">
      <line class="axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"/>
      <line class="axis" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}"/>
      <text x="8" y="${pad.top + 4}">${fmt(max, 1)}${options.unit || ""}</text>
      <text x="8" y="${height - pad.bottom + 4}">${fmt(min, 1)}${options.unit || ""}</text>
      ${paths}
      ${xLabels}
      ${legend}
    </svg>
  `;
}

function initMap() {
  if (!window.L || !els.map) {
    els.map.textContent = "지도를 불러오지 못했습니다.";
    return;
  }

  state.map = L.map(els.map, {
    zoomControl: false,
    attributionControl: true
  }).setView([state.currentPlace.latitude, state.currentPlace.longitude], 10);

  L.control.zoom({ position: "bottomright" }).addTo(state.map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap"
  }).addTo(state.map);

  state.map.on("click", async (event) => {
    const place = {
      id: `map-${event.latlng.lat.toFixed(5)}-${event.latlng.lng.toFixed(5)}`,
      name: "지도 선택 위치",
      latitude: Number(event.latlng.lat.toFixed(6)),
      longitude: Number(event.latlng.lng.toFixed(6)),
      source: "지도 클릭"
    };
    selectPlace(place);
    if (state.mapClickMarker) state.map.removeLayer(state.mapClickMarker);
    state.mapClickMarker = L.marker([place.latitude, place.longitude]).addTo(state.map).bindPopup("지도 선택 위치").openPopup();
    await refreshForecast();
  });
}

function updateMap() {
  if (!state.map || !state.currentPlace) return;

  state.markers.forEach((marker) => marker.remove());
  state.markers = state.favorites.map((place) => {
    const marker = L.marker([place.latitude, place.longitude])
      .addTo(state.map)
      .bindPopup(`<strong>${escapeHtml(place.name)}</strong><br><button type="button" data-map-select="${place.id}">조회</button>`);
    marker.on("popupopen", () => {
      setTimeout(() => {
        document.querySelectorAll(`[data-map-select="${place.id}"]`).forEach((button) => {
          button.addEventListener("click", async () => {
            selectPlace(place);
            await refreshForecast();
          });
        });
      }, 0);
    });
    return marker;
  });

  state.map.setView([state.currentPlace.latitude, state.currentPlace.longitude], Math.max(state.map.getZoom(), 10), { animate: true });
}

function handleSearchInput() {
  window.clearTimeout(state.searchTimer);
  state.searchRequestId += 1;
  const query = els.searchInput.value.trim();
  if (query.length < 2) {
    showFavoriteSuggestions();
    return;
  }
  state.searchTimer = window.setTimeout(() => searchPlaces(), 450);
}

function showFavoriteSuggestions() {
  const query = els.searchInput.value.trim().toLocaleLowerCase("ko-KR");
  const places = [...state.favorites];
  if (state.currentPlace && !places.some((place) => place.id === state.currentPlace.id)) {
    places.unshift(state.currentPlace);
  }
  const favorites = places.filter((place) => {
    if (!query || query === state.currentPlace?.name.toLocaleLowerCase("ko-KR")) return true;
    return place.name.toLocaleLowerCase("ko-KR").includes(query);
  });

  if (!favorites.length && query.length >= 2) return;

  els.searchResults.innerHTML = `
    <div class="search-results-label">저장한 장소</div>
    ${favoriteSuggestionGroups(favorites)}
  `;
  openSearchResults();
  bindSearchResultEvents();
  renderIcons();
}

async function searchPlaces(event) {
  event?.preventDefault();
  window.clearTimeout(state.searchTimer);
  const query = els.searchInput.value.trim();
  if (!query) {
    showFavoriteSuggestions();
    return;
  }

  const requestId = ++state.searchRequestId;
  openSearchResults();
  els.searchResults.innerHTML = `
    <div class="search-loading" role="status">
      <i data-lucide="loader-circle"></i>
      <span>장소를 찾는 중</span>
    </div>
  `;
  renderIcons();

  try {
    const url = new URL("/api/geocode", window.location.origin);
    url.searchParams.set("q", query);
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "검색 실패");
    if (requestId !== state.searchRequestId) return;

    if (!data.results.length) {
      els.searchResults.innerHTML = `
        <div class="search-empty">
          <i data-lucide="map-pin-off"></i>
          <span>검색 결과가 없습니다. 지역명을 함께 입력해 보세요.</span>
        </div>
      `;
      return;
    }

    els.searchResults.innerHTML = `
      <div class="search-results-label">검색 결과</div>
      ${data.results.map((place) => searchResultButton(place)).join("")}
    `;
    bindSearchResultEvents();
  } catch (error) {
    if (requestId !== state.searchRequestId) return;
    els.searchResults.innerHTML = `
      <div class="search-empty">
        <i data-lucide="circle-alert"></i>
        <span>${escapeHtml(error.message)}</span>
      </div>
    `;
  } finally {
    if (requestId === state.searchRequestId) renderIcons();
  }
}

function searchResultButton(place, options = {}) {
  const detail = options.favorite || options.current
    ? `${options.current ? "현재 선택" : "즐겨찾기"} · ${place.source || "사용자 저장"}`
    : place.label || `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`;
  const icon = options.favorite || options.current ? "bookmark" : place.type === "beach" ? "waves" : "map-pin";
  return `
    <button
      class="search-result"
      type="button"
      role="option"
      data-result='${escapeAttribute(JSON.stringify(place))}'
    >
      <span class="search-result-main">
        <span class="search-result-icon"><i data-lucide="${icon}"></i></span>
        <span class="search-result-copy">
          <strong>${escapeHtml(place.name)}</strong>
          <small>${escapeHtml(detail)}</small>
        </span>
      </span>
      ${options.favorite || options.current ? "" : `<span class="source-pill">${escapeHtml(place.source || "장소 검색")}</span>`}
    </button>
  `;
}

function favoriteSuggestionGroups(places) {
  return placesByRegion(places).map(([region, regionPlaces]) => `
    <div class="search-group-label">${escapeHtml(region)}</div>
    ${regionPlaces.map((place) => searchResultButton(place, {
      favorite: state.favorites.some((favorite) => favorite.id === place.id),
      current: place.id === state.currentPlace?.id
    })).join("")}
  `).join("");
}

function favoriteSettingsGroups(places) {
  return placesByRegion(places).map(([region, regionPlaces]) => `
    <div class="favorite-group-label">${escapeHtml(region)}</div>
    ${regionPlaces.map((place) => favoriteSettingsItem(place)).join("")}
  `).join("");
}

function favoriteSettingsItem(place) {
  return `
    <div class="favorite-item">
      <button class="search-result" type="button" data-place-id="${place.id}">
        <span>
          <strong>${escapeHtml(place.name)}</strong>
          <small>${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)} · ${escapeHtml(place.source || "사용자 저장")}</small>
        </span>
      </button>
      <button class="icon-button" type="button" data-remove-id="${place.id}" aria-label="${escapeHtml(place.name)} 삭제" title="즐겨찾기 삭제">
        <i data-lucide="trash-2"></i>
      </button>
    </div>
  `;
}

function placeRegion(place) {
  if (place.region) return place.region;
  const prefix = String(place.name || "").match(/^(.+?)\s-\s/u)?.[1]?.trim();
  return prefix || "기타";
}

function placesByRegion(places) {
  const groups = new Map();
  places.forEach((place) => {
    const region = placeRegion(place);
    if (!groups.has(region)) groups.set(region, []);
    groups.get(region).push(place);
  });
  const preferredOrder = ["고성", "속초", "삼척", "기타"];
  return [...groups.entries()].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a[0]);
    const bIndex = preferredOrder.indexOf(b[0]);
    return (aIndex < 0 ? preferredOrder.length : aIndex)
      - (bIndex < 0 ? preferredOrder.length : bIndex);
  });
}

function bindSearchResultEvents() {
  els.searchResults.querySelectorAll("[data-result]").forEach((button) => {
    button.addEventListener("click", async () => {
      const place = JSON.parse(button.dataset.result);
      selectPlace({
        ...place,
        id: state.favorites.some((favorite) => favorite.id === place.id)
          ? place.id
          : `search-${place.latitude.toFixed(5)}-${place.longitude.toFixed(5)}`
      });
      closeSearchResults();
      await refreshForecast();
    });
  });
}

function handlePlacePickerKeydown(event) {
  if (event.key === "Escape") {
    closeSearchResults();
    els.searchInput.value = state.currentPlace?.name || "";
    els.searchInput.focus();
    return;
  }

  if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
  const options = [...els.searchResults.querySelectorAll(".search-result")];
  if (!options.length) return;
  event.preventDefault();
  const currentIndex = options.indexOf(document.activeElement);
  const nextIndex = currentIndex < 0
    ? event.key === "ArrowDown" ? 0 : options.length - 1
    : event.key === "ArrowDown"
      ? (currentIndex + 1) % options.length
      : (currentIndex - 1 + options.length) % options.length;
  options[nextIndex].focus();
}

function openSearchResults() {
  els.searchResults.classList.remove("is-hidden");
  els.searchInput.setAttribute("aria-expanded", "true");
}

function closeSearchResults(options = {}) {
  els.searchResults.classList.add("is-hidden");
  els.searchInput.setAttribute("aria-expanded", "false");
  if (options.restoreValue && state.currentPlace) {
    els.searchInput.value = state.currentPlace.name;
  }
}

function useCurrentLocation() {
  if (!navigator.geolocation) {
    showToast("현재 위치를 사용할 수 없습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    selectPlace({
      id: `current-${position.coords.latitude.toFixed(5)}-${position.coords.longitude.toFixed(5)}`,
      name: "현재 위치",
      latitude: Number(position.coords.latitude.toFixed(6)),
      longitude: Number(position.coords.longitude.toFixed(6)),
      source: "브라우저 위치"
    });
    await refreshForecast();
  }, () => {
    showToast("현재 위치 권한이 없거나 위치를 확인하지 못했습니다.");
  }, { enableHighAccuracy: true, timeout: 8000 });
}

function loadFavorites() {
  let stored = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE.favorites) || "null");
    if (Array.isArray(parsed)) stored = parsed;
  } catch (error) {
    localStorage.removeItem(STORAGE.favorites);
  }

  const savedVersion = localStorage.getItem(STORAGE.defaultPlacesVersion);
  if (stored.length && savedVersion === DEFAULT_PLACES_VERSION) return stored;

  const defaultIds = new Set(DEFAULT_PLACES.map((place) => place.id));
  const customPlaces = stored
    .filter((place) => !defaultIds.has(place.id))
    .map((place) => place.id === "kumho-seorak"
      ? { ...place, name: "속초 - 금호설악리조트", region: "속초" }
      : place);
  const merged = [...DEFAULT_PLACES, ...customPlaces];
  localStorage.setItem(STORAGE.favorites, JSON.stringify(merged));
  localStorage.setItem(STORAGE.defaultPlacesVersion, DEFAULT_PLACES_VERSION);
  return merged;
}

function loadKmaApiKey() {
  return (localStorage.getItem(STORAGE.kmaApiKey) || "").trim();
}

function findInitialPlace() {
  const lastId = localStorage.getItem(STORAGE.lastPlaceId);
  return state.favorites.find((place) => place.id === lastId) || state.favorites[0];
}

function getPlaceById(id) {
  if (state.currentPlace?.id === id) return state.currentPlace;
  return state.favorites.find((place) => place.id === id);
}

function selectPlace(place) {
  if (!place) return;
  state.currentPlace = place;
  localStorage.setItem(STORAGE.lastPlaceId, place.id);
  renderPlaceOptions();
  updateMap();
}

function renderPlaceOptions() {
  if (!state.currentPlace) return;
  if (document.activeElement !== els.searchInput) {
    els.searchInput.value = state.currentPlace.name;
  }
}

function addFavorite(place) {
  if (!place) return;
  const exists = state.favorites.some((item) => item.id === place.id);
  if (!exists) {
    state.favorites.push({ ...place, source: place.source || "사용자 저장" });
    saveFavorites();
    showToast("즐겨찾기에 저장했습니다.");
  } else {
    showToast("이미 즐겨찾기에 있습니다.");
  }
  renderPlaceOptions();
  renderSettingsView();
  updateMap();
}

function removeFavorite(id) {
  if (state.favorites.length <= 1) {
    showToast("즐겨찾기는 하나 이상 남겨둡니다.");
    return;
  }
  state.favorites = state.favorites.filter((place) => place.id !== id);
  if (state.currentPlace?.id === id) state.currentPlace = state.favorites[0];
  saveFavorites();
  renderPlaceOptions();
  renderSettingsView();
  updateMap();
}

function saveFavorites() {
  localStorage.setItem(STORAGE.favorites, JSON.stringify(state.favorites));
}

function syncDateWithForecast() {
  const dates = availableDates();
  if (!dates.length) return;
  if (!dates.includes(state.startDate)) state.startDate = dates[0];
  if (!dates.includes(state.endDate)) state.endDate = state.startDate;
  if (state.endDate < state.startDate) state.endDate = state.startDate;

  els.startDateInput.value = state.startDate;
  els.endDateInput.value = state.endDate;
  els.startDateInput.min = dates[0];
  els.startDateInput.max = dates[dates.length - 1];
  els.endDateInput.min = dates[0];
  els.endDateInput.max = dates[dates.length - 1];
  saveDateRange();
}

function availableDates() {
  const dates = new Set();
  for (const model of state.forecast?.models?.models || []) {
    for (const hour of model.hours || []) dates.add(dateKey(hour.time));
  }
  return [...dates].sort();
}

function modelHoursForDate() {
  const models = state.forecast?.models;
  if (!models || models.status !== "ok") return [];
  return models.models.map((model) => {
    const hours = (model.hours || []).filter((hour) => dateInSelectedRange(hour.time));
    return { ...model, hours, hoursByTime: new Map(hours.map((hour) => [hour.time, hour])) };
  });
}

function marineHoursForDate() {
  const marine = state.forecast?.marine;
  if (!marine || marine.status !== "ok") return [];
  return (marine.hours || []).filter((hour) => dateInSelectedRange(hour.time));
}

function commonTimes(models) {
  if (!models.length) return [];
  const first = models[0].hours.map((hour) => hour.time);
  return first.filter((time) => models.every((model) => model.hoursByTime?.has(time)));
}

function activeWarnings() {
  const kma = state.forecast?.kma;
  if (!kma || kma.status !== "ok") return [];
  const hazardWords = ["호우", "강풍", "풍랑", "태풍", "낙뢰", "뇌전", "해일", "대설"];
  return (kma.warnings || []).filter((warning) => {
    const text = `${warning.title || ""} ${warning.level || ""} ${warning.message || ""}`;
    return hazardWords.some((word) => text.includes(word));
  });
}

function loadPreviousSnapshot() {
  try {
    const raw = localStorage.getItem(snapshotKey());
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function storeCurrentSnapshot() {
  const snapshot = createSnapshot();
  if (!snapshot) return;
  localStorage.setItem(snapshotKey(), JSON.stringify(snapshot));
}

function snapshotKey() {
  return `${STORAGE.snapshotPrefix}${state.currentPlace?.id || "none"}:${state.startDate}:${state.endDate}`;
}

function saveDateRange() {
  localStorage.setItem(STORAGE.lastStartDate, state.startDate);
  localStorage.setItem(STORAGE.lastEndDate, state.endDate);
  localStorage.setItem(STORAGE.lastDate, state.startDate);
}

function buildSummaryLine(consensus, rainWindow, maxWave, status) {
  const rainText = rainWindow ? `비 가능 시간 ${rainWindow}` : "뚜렷한 비 시간 없음";
  const waveText = maxWave === null ? "해양 자료 없음" : `파고 최대 ${fmt(maxWave, 2)}m`;
  return `${rainText}, ${waveText}, 판단 상태 ${status}.`;
}

function describeKmaPeriod(hours) {
  if (!hours.length) return "자료 없음";
  const sky = modeText(hours.map((hour) => hour.sky).filter(Boolean)) || "하늘 정보 없음";
  const pty = modeText(hours.map((hour) => hour.precipitationType).filter((value) => value && value !== "없음"));
  return pty ? `${sky}, ${pty}` : sky;
}

function serviceLabel(label, service) {
  if (!service) return `${label} 없음`;
  if (service.status === "ok") return `${label} 연결`;
  if (service.status === "disabled") return `${label} 키 없음`;
  return `${label} 오류`;
}

function serviceStatusText(service) {
  if (!service) return "없음";
  if (service.status === "ok") return "활성";
  if (service.status === "disabled") return "키 없음";
  return "오류";
}

function serviceStatusClass(service) {
  if (!service || service.status === "error") return "danger-text";
  if (service.status === "disabled") return "watch-text";
  return "good-text";
}

function statusClass(status) {
  if (status === "양호") return "status-good";
  if (status === "주의") return "status-watch";
  return "status-hold";
}

function consensusClass(percent) {
  if (percent >= 70) return "status-good";
  if (percent >= 45) return "status-watch";
  return "status-hold";
}

function statusRank(status) {
  return status === "양호" ? 0 : status === "주의" ? 1 : 2;
}

function isRainSignal(hour) {
  if (!hour) return false;
  return Number(hour.precipitation) >= CONFIG.thresholds.rainMm ||
    Number(hour.precipitationProbability) >= CONFIG.thresholds.rainProbability;
}

function modelIcon(modelId) {
  return ({ ecmwf: "globe-2", gfs: "satellite", icon: "radar" })[modelId] || "chart-line";
}

function weatherIcon(hour) {
  const code = Number(hour.weatherCode);
  if (code >= 95) return "cloud-lightning";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "cloud-snow";
  if (Number(hour.precipitation) >= CONFIG.thresholds.rainMm || code >= 51 && code <= 82) return "cloud-rain";
  if (code === 45 || code === 48) return "cloud-fog";
  if (Number(hour.cloudCover) >= 80 || code === 3) return "cloud";
  if (Number(hour.cloudCover) >= 35 || code === 2) return "cloud-sun";
  return "sun";
}

function kmaIcon(hour) {
  const text = `${hour.sky || ""} ${hour.precipitationType || ""}`;
  if (text.includes("낙뢰") || text.includes("뇌")) return "cloud-lightning";
  if (text.includes("눈")) return "cloud-snow";
  if (hour.precipitationType && hour.precipitationType !== "없음") return "cloud-rain";
  if (text.includes("흐림")) return "cloud";
  if (text.includes("구름")) return "cloud-sun";
  return "sun";
}

function accuweatherIcon(hour) {
  const text = hour.weatherText || "";
  if (text.includes("뇌") || text.includes("Thunder")) return "cloud-lightning";
  if (text.includes("눈") || text.includes("Snow")) return "cloud-snow";
  if (text.includes("비") || text.includes("Rain") || Number(hour.precipitationProbability) >= CONFIG.thresholds.rainProbability) return "cloud-rain";
  if (text.includes("흐") || text.includes("Cloud")) return "cloud";
  return "sun";
}

function weatherTone(icon, kind) {
  if (kind === "marine") return icon === "wind" ? "wind" : "marine";
  return ({
    sun: "sunny",
    "cloud-sun": "partly",
    cloud: "cloudy",
    "cloud-rain": "rain",
    "cloud-lightning": "thunder",
    "cloud-fog": "fog",
    "cloud-snow": "snow",
    wind: "wind",
    waves: "marine"
  })[icon] || "neutral";
}

function forecastPeriod(time) {
  const hour = hourNumber(time);
  const isSwimHours = hour >= 9 && hour < 18;
  return {
    className: isSwimHours ? "is-swim-hours" : "is-off-hours",
    icon: isSwimHours ? "sun" : "moon",
    label: isSwimHours ? "물놀이 중심 시간" : "참고 시간",
    isStart: hour === 9 || hour === 18
  };
}

function marineIcon(hour) {
  if (Number(hour.gust) >= CONFIG.thresholds.cautionGust) return "wind";
  if (Number(hour.waveHeight) >= CONFIG.thresholds.cautionWave) return "waves";
  return "waves";
}

function firstRainTime(hours) {
  const found = hours.find(isRainSignal);
  return found?.time || null;
}

function rainStartDiff(previous, current) {
  if (!previous && !current) return { label: "변화 없음", className: "good-text" };
  if (!previous && current) return { label: "새 강수 신호", className: "watch-text" };
  if (previous && !current) return { label: "강수 신호 사라짐", className: "good-text" };
  const delta = minutesSinceEpoch(current) - minutesSinceEpoch(previous);
  if (delta > 0) return { label: `${Math.round(delta / 60)}시간 늦어짐`, className: "good-text" };
  if (delta < 0) return { label: `${Math.abs(Math.round(delta / 60))}시간 앞당겨짐`, className: "watch-text" };
  return { label: "변화 없음", className: "good-text" };
}

function directionText(degrees) {
  if (!Number.isFinite(Number(degrees))) return "정보 없음";
  const labels = ["북", "북북동", "북동", "동북동", "동", "동남동", "남동", "남남동", "남", "남남서", "남서", "서남서", "서", "서북서", "북서", "북북서"];
  const index = Math.round((Number(degrees) % 360) / 22.5) % 16;
  return labels[index];
}

function modelLabel(id) {
  return ({ ecmwf: "ECMWF", gfs: "GFS", icon: "ICON" })[id] || id;
}

function metricHtml(label, value, detail) {
  return `
    <div class="metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small class="muted">${escapeHtml(String(detail || ""))}</small>
    </div>
  `;
}

function renderError(error) {
  els.summaryTitle.textContent = "예보를 불러오지 못했습니다";
  els.summaryText.textContent = error.message || "잠시 후 다시 시도하세요.";
  els.summaryMetrics.innerHTML = "";
  els.recommendationCard.innerHTML = "";
}

function showLoading(show) {
  els.loadingState.classList.toggle("is-hidden", !show);
}

function activateTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === tab);
  });
  if (state.forecast) {
    renderActiveTab();
    renderIcons();
  }
  if (tab === "summary" && state.map) {
    setTimeout(() => state.map.invalidateSize(), 120);
  }
}

function bindHorizontalDrag(element) {
  if (!element) return;

  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  element.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startScrollLeft = element.scrollLeft;
    element.classList.add("is-dragging");
    element.setPointerCapture(event.pointerId);
  });

  element.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    element.scrollLeft = startScrollLeft - (event.clientX - startX);
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    element.classList.remove("is-dragging");
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
  };

  element.addEventListener("pointerup", stopDragging);
  element.addEventListener("pointercancel", stopDragging);
}

function bindUnifiedCompareScroll(root) {
  const rails = [...root.querySelectorAll(".compare-section .forecast-rail")];
  const master = root.querySelector(".compare-master-scroll");
  const track = root.querySelector(".compare-master-track");
  if (!master || !track || rails.length < 1) return;

  const syncTrackWidth = () => {
    const width = Math.max(master.clientWidth, ...rails.map((rail) => rail.scrollWidth));
    track.style.width = `${width}px`;
  };
  let syncing = false;

  syncTrackWidth();
  requestAnimationFrame(syncTrackWidth);
  bindHorizontalDrag(master);

  const syncTo = (source, left) => {
    if (syncing) return;
    syncing = true;
    rails.forEach((rail) => {
      if (rail !== source) rail.scrollLeft = left;
    });
    if (master !== source) master.scrollLeft = left;
    requestAnimationFrame(() => {
      syncing = false;
    });
  };

  rails.forEach((rail) => {
    rail.addEventListener("scroll", () => {
      syncTo(rail, rail.scrollLeft);
    }, { passive: true });
  });

  master.addEventListener("scroll", () => {
    syncTo(master, master.scrollLeft);
  }, { passive: true });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("is-hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.add("is-hidden"), 2800);
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function todayKst() {
  return dateKey(new Date().toLocaleString("sv-SE", { timeZone: CONFIG.timezone }).replace(" ", "T"));
}

function dateKey(isoTime) {
  return String(isoTime || "").slice(0, 10);
}

function dateInSelectedRange(isoTime) {
  const key = dateKey(isoTime);
  return key >= state.startDate && key <= state.endDate;
}

function hourNumber(isoTime) {
  return Number(String(isoTime || "").slice(11, 13));
}

function minutesOfDay(isoTime) {
  return hourNumber(isoTime) * 60 + Number(String(isoTime || "").slice(14, 16) || 0);
}

function minutesSinceEpoch(isoTime) {
  const value = Date.parse(`${String(isoTime).slice(0, 16)}:00+09:00`);
  return Number.isFinite(value) ? Math.round(value / 60000) : 0;
}

function formatHour(isoTime) {
  const text = String(isoTime || "");
  return text.length >= 13 ? `${text.slice(11, 13)}:00` : "정보 없음";
}

function formatTableTime(isoTime) {
  const text = String(isoTime || "");
  if (text.length < 13) return "정보 없음";
  if (state.startDate === state.endDate) return formatHour(text);
  return `${Number(text.slice(5, 7))}/${Number(text.slice(8, 10))} ${formatHour(text)}`;
}

function addHoursIso(isoTime, hours) {
  const shifted = new Date(Date.parse(`${isoTime}:00+09:00`) + hours * 60 * 60 * 1000);
  return shifted
    .toLocaleString("sv-SE", { timeZone: CONFIG.timezone, hour12: false })
    .replace(" ", "T")
    .slice(0, 16);
}

function formatKoreanDate(date) {
  const parsed = new Date(`${date}T00:00:00+09:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: CONFIG.timezone,
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(parsed);
}

function formatDateRangeLabel() {
  if (state.startDate === state.endDate) return formatKoreanDate(state.startDate);
  return `${formatKoreanDate(state.startDate)} ~ ${formatKoreanDate(state.endDate)}`;
}

function formatDateTime(isoTime) {
  if (!isoTime) return "정보 없음";
  const date = new Date(isoTime);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: CONFIG.timezone,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatKmaIssued(date, time) {
  if (!date || !time) return "정보 없음";
  return `${date.slice(4, 6)}월 ${date.slice(6, 8)}일 ${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

function fmt(value, digits = 1) {
  if (!Number.isFinite(Number(value))) return "-";
  return Number(value).toFixed(digits);
}

function signed(value, unit) {
  if (!Number.isFinite(Number(value))) return "-";
  const sign = Number(value) > 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(unit === "m" ? 2 : 1)}${unit}`;
}

function minValue(values) {
  const clean = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  return clean.length ? Math.min(...clean) : null;
}

function maxValue(values) {
  const clean = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  return clean.length ? Math.max(...clean) : null;
}

function avgValue(values) {
  const clean = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : null;
}

function sumValue(values) {
  return values.filter((value) => Number.isFinite(Number(value))).reduce((sum, value) => sum + Number(value), 0);
}

function modeText(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function escapeSvg(value) {
  return escapeHtml(value);
}
