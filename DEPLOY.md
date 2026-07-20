# 웹페이지 배포

이 앱은 Vercel에 올리면 웹페이지 주소로 사용할 수 있습니다. `index.html`과 정적 파일은 웹페이지로 제공되고, `api/forecast.js`, `api/geocode.js`는 서버리스 API로 실행됩니다.

## 1. Vercel 로그인

Windows PowerShell에서 `npx`가 막히면 `npx.cmd`를 사용하세요.

```bash
npx.cmd vercel login
```

브라우저에서 로그인 인증을 완료합니다.

## 2. 환경변수 등록

Vercel 프로젝트의 Environment Variables에 아래 값을 등록합니다.

```bash
KMA_API_PROVIDER=apihub
KMA_API_KEY=발급받은_기상청_API허브_키
ACCUWEATHER_API_KEY=
```

`ACCUWEATHER_API_KEY`는 없으면 비워둬도 됩니다. KMA는 API허브에서 단기예보 API 활용신청이 승인되어야 활성화됩니다.

## 3. 배포

```bash
npx.cmd vercel --prod
```

배포가 끝나면 Vercel이 알려주는 `https://...vercel.app` 주소가 웹페이지 주소입니다.

## 확인

- `/` : 해변 예보 비교 웹페이지
- `/api/forecast?lat=38.2759&lon=128.5534&days=2` : 예보 API
- `/api/geocode?q=속초` : 장소 검색 API
