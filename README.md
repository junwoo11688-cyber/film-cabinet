# FILM INDEX

35mm 필름과 일회용·재장전 카메라를 함께 탐색하는 한국어 아카이브입니다. 필름의 브랜드 국가와 실제 제조국을 분리하고, 카메라 내장 필름의 별도 판매 여부와 원판 공개 상태를 구분합니다. 공개되지 않은 원판은 추정하지 않습니다.

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS와 프로젝트 전용 CSS
- Lucide Icons
- 로컬 TypeScript 데이터, 브라우저 `localStorage` 즐겨찾기·비교
- 정적 내보내기(`out/`), 별도 백엔드 없음

## 폴더 구조

```text
app/                 URL별 페이지와 전역 스타일
components/          카드, 탐색 필터, 비교, 즐겨찾기, 탐색 메뉴
data/brands.ts       브랜드와 브랜드 국가
data/countries.ts    국가 표시
data/films.ts        필름 레코드
data/catalog-expansion.ts  2026-09-25 전수 감사에서 누락된 제품과 새로 발견한 제품
data/master-catalog.ts      독립 마스터 목록(125종)과 기존 안정 ID 매핑
data/cameras.ts      카메라 레코드
data/exclusive.ts    카메라 내장 필름 분류
data/types.ts        레코드 스키마
lib/format.ts        공통 레이블과 ISO 구간
lib/catalog-audit.ts  데이터 무결성 점검
scripts/audit-films.mjs  CLI 감사 실행기
public/              파비콘 및 향후 이미지
```

## 실행

Node.js 20.9 이상과 pnpm이 필요합니다.

```bash
pnpm install
pnpm dev
```

`http://localhost:3000`에서 확인합니다. 정적 사이트를 생성하려면 `pnpm build`를 실행하세요. 결과는 `out/`에 저장됩니다.

## Film Data Architecture

기존 `data/films.ts`의 28개 Film 객체는 유지했습니다. 전수 감사에서 마스터 125종 중 26종이 이미 존재했고, 빠진 99종만 `data/catalog-expansion.ts`에 추가했습니다. 별도로 공식 카탈로그와 판매처에서 발견한 제품은 `newlyDiscovered: true`로 표시합니다. `films.ts`의 `film()` 함수가 기본 점수와 브랜드 국가를 채우고 두 데이터 소스를 합칩니다. 새 제품의 특성 점수와 발색은 충분히 확인되지 않아 상세 화면과 비교표에서 **미평가**로 표시합니다.

`data/master-catalog.ts`는 실제 Film 객체와 별도로 유지하는 비교 기준입니다. 이름만 다른 기존 제품은 원래 `id`를 연결하므로 즐겨찾기·URL이 깨지지 않습니다. 컷 수와 묶음 판매는 별도 Film이 아니라 `availableExposures`와 `packageVariants`로 관리합니다.

## Catalog Audit

```bash
pnpm audit:films
```

`/data-audit`에서도 등록 수, 마스터 누락, 중복, 원판·판매상태 미확인, 지역 제품과 품절 제품을 볼 수 있습니다. 이 경로는 탐색 메뉴와 검색엔진에 노출하지 않습니다. CLI는 중복 ID·slug·동일 브랜드 제품명, 없는 브랜드, 누락된 마스터 항목, 지역 정보 누락, 공식 현행의 출처 누락, 단종/재고 충돌, 제조사 미공개와 Verified 충돌, 끊어진 카메라 연결을 검사합니다. 추가 후 `pnpm audit:films`, `pnpm typecheck`, `pnpm build`를 실행합니다.

## 데이터 추가

### 브랜드

`data/brands.ts`의 `brands` 배열에 고유 `id`, 이름, **브랜드 소재 국가**, 분류, 브랜드 형태, 자체 제조 여부, 소개, 카드 색상을 추가합니다. 브랜드 소재 국가를 원판 제조국으로 사용하지 마세요. 새 국가가 필요하면 `data/countries.ts`에도 추가합니다.

### 필름

`data/catalog-expansion.ts`에 새 `CatalogFilmSeed`를 추가하고, 마스터 대상이라면 `data/master-catalog.ts`에도 ID를 추가합니다. `brandId`는 등록된 브랜드 `id`와 같아야 하며, `id`와 기본 `slug`가 `/film/[slug]` 주소가 됩니다. ISO, 필름 종류, 현상 방식, `catalogStatus`, `availabilityStatus`, 색상 프로필, 촬영 추천, 출처를 입력합니다. 원판·실제 제조사가 공개되지 않았으면 값을 추정해 넣지 않고 비워 두며 `dataConfidence: "unknown"`을 사용합니다. 필요하면 점수를 근거에 맞춰 조정합니다.

### 카메라

`data/cameras.ts`의 `cameras` 배열에 `camera({...})` 항목을 추가합니다. `cameraType`으로 `single-use`, `preloaded-reusable`, `reusable`을 구분하고 `reloadable` 값을 일치시킵니다. `embeddedFilmName`에는 제조사가 공개한 수준까지만 적습니다. ISO가 같다는 이유로 다른 필름을 연결하지 않습니다. 렌즈·조리개·셔터가 미공개이면 빈 값으로 둡니다.

### Exclusive Film 등록

내장 필름의 별도 판매 여부를 검토한 후 카메라에 다음 값을 사용합니다.

- `camera-exclusive` + `unavailable`: 동일한 일반 롤 제품이 별도로 확인되지 않는 경우
- `unknown-stock` + `unknown`: 정확한 원판 또는 판매 여부를 확인하지 못한 경우
- `commercial-film` + `available`: 일반 롤도 판매되는 경우
- `pre-exposed-effect`: 미리 노광된 효과가 들어간 경우

`data/exclusive.ts`의 `exclusiveEntries`에 내장 필름 이름과 카메라 ID를 추가하면 A/B/C 분류 및 상세 화면에 표시됩니다. `camera-exclusive`는 시기·지역별 판매 상태가 바뀔 수 있으므로 확인 후 갱신하세요.

### 필름 ↔ 카메라 연결

카메라의 `linkedFilmId`에 필름 ID를 적고, 필름의 `usedInCameras`에 카메라 ID를 적습니다. 제조사 자료 등으로 **정확히 동일한 필름**이 확인된 경우에만 `exactFilmMatch: true`를 사용합니다. 같은 제품군이지만 동일성이 확인되지 않았다면 `linkedFilmId`를 둘 수 있어도 `exactFilmMatch: false`로 유지하고 `notes`에 이유를 적습니다.

### `dataConfidence`

- `verified`: 제조사 또는 공식 문서에 명시된 정보
- `likely`: 일부 정보가 제한되지만 비교적 근거가 있는 정보
- `unknown`: 원판·제조사·제품 정보가 공개되지 않은 경우

공식 문서가 있으면 `sources: [{ name, url, sourceTier }]`에 연결합니다. `sourceTier`는 `manufacturer`, `official-distributor`, `authorized-retailer`, `specialist-retailer`, `secondary` 중 하나입니다. 브랜드 공식 자료가 제품의 존재를 확인하더라도 원판 제조사를 공개하지 않았다면 `dataConfidence`를 Verified로 올리지 않습니다. 신뢰도는 레코드 전반에 대한 보수적인 표시이며, 모든 세부 필드의 개별 검증을 뜻하지 않습니다.

## Availability Model

`catalogStatus`는 공식 현행, 공식 레거시, 소매 유통, 지역 현행, 미확인을 구분합니다. `availabilityStatus`는 재고 있음, 품절, 예약, 소매 구매, 지역 판매, 확인 필요, 단종을 구분합니다. `official-current`와 `out-of-stock`은 함께 사용할 수 있습니다. 품절을 단종으로 자동 바꾸지 않습니다. 목록의 “현재 구매 가능” 필터에는 `in-stock`, `retail-available`, `regional`, `preorder`가 포함됩니다.

## Regional Availability

`marketRegions`는 확인된 판매 지역만 기록합니다. 예를 들어 일본 전용 공식 목록에서 확인된 제품은 `["Japan"]`으로 저장합니다. 빈 값은 전 세계 판매를 뜻하지 않고 **지역 미확인**입니다. `Worldwide`는 국제 스토어에서 제품을 찾을 수 있는 경우에만 사용하며 개별 국가의 재고를 보증하지 않습니다. `availabilityCheckedAt`은 **실제 판매 상태를 확인한 날짜**에만 기록합니다.

## Source Confidence

출처는 실제 제조사·브랜드 공식 사이트, 공식 지역 페이지, 공식 유통사, 전문 판매점 순으로 검토합니다. 판매점의 신품 재고는 현재 생산의 증거가 아닙니다. 공개되지 않은 제조사·원판을 Kodak Vision3 등으로 추정하지 않습니다. `verified`는 공식 자료로 제조 관계까지 확인된 경우, `likely`는 여러 자료가 일치하지만 일부 공개 정보가 제한된 경우, `unknown`은 제조사 또는 원판이 미공개인 경우에 사용합니다.

## Exclusive Film System / Film-Camera Linking

일회용 카메라의 내장 필름이 일반 롤과 정확히 같은 경우에만 `exactFilmMatch: true`로 연결합니다. 이름이나 ISO만 같은 경우에는 `false`를 사용하고 카메라에 `embeddedFilmName`과 이유를 남깁니다. `data/exclusive.ts`의 A/B/C 분류는 별도 판매 여부와 원판 공개 여부를 설명합니다. 카메라에서만 만날 수 있다는 표시는 같은 135 롤의 별도 판매가 확인되지 않을 때만 사용합니다.

## 이미지 추가

초기 버전은 외부 쇼핑몰 사진을 사용하지 않고 카드 그래픽을 코드로 그립니다. 나중에 사용 권한이 확인된 사진을 `public/`에 추가하고 필름 또는 카메라의 `imageUrl`에 경로를 넣을 수 있습니다. 카드·상세 컴포넌트에서 해당 필드를 우선 표시하도록 확장하세요.

## API / CMS 전환

현재 페이지는 `data/`의 배열을 직접 읽습니다. 추후 API나 CMS로 이전할 때 `Film`, `Camera`, `Brand` 타입과 ID 관계를 유지한 채 데이터 로더만 교체하면 됩니다. 정적 내보내기는 빌드 시 모든 상세 경로를 생성하므로, 실시간 데이터가 필요해지면 Next.js 서버 배포로 전환하고 `generateStaticParams` 전략을 조정하세요. 즐겨찾기와 비교는 현재 기기별 브라우저 저장소를 사용합니다.

## 데이터 주의

초기 레코드는 제품의 지역·시기에 따라 구성이 달라질 수 있습니다. 특히 일회용 카메라의 내장 필름 원판과 별도 판매 여부는 최신 제조사 자료로 주기적으로 확인해야 합니다. 공식 자료가 확인된 일부 항목은 상세 페이지에 출처를 붙였습니다.
