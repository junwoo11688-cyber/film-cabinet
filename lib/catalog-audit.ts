import type { Brand, Camera, Film } from "../data/types";
import type { CanonicalFilm } from "../data/master-catalog";

export type AuditIssue = { code: string; filmId?: string; detail: string };
const unknown = (value?: string) => !value || /unknown|공개|미상|불명/i.test(value);
const productKey = (film: Pick<Film, "brandId" | "name">) => `${film.brandId}:${film.name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9가-힣]/g, "")}`;

export function auditCatalog(films: Film[], brands: Brand[], cameras: Camera[], canonical: CanonicalFilm[]) {
  const issues: AuditIssue[] = [];
  const filmById = new Map<string, Film>();
  const ids = new Set<string>(), slugs = new Set<string>(), names = new Set<string>();
  const brandIds = new Set(brands.map(item => item.id));
  const cameraIds = new Set(cameras.map(item => item.id));
  for (const film of films) {
    if (ids.has(film.id)) issues.push({code:"duplicate-id",filmId:film.id,detail:`중복 ID: ${film.id}`});
    ids.add(film.id);
    if (slugs.has(film.slug)) issues.push({code:"duplicate-slug",filmId:film.id,detail:`중복 slug: ${film.slug}`});
    slugs.add(film.slug);
    const name = productKey(film);
    if (names.has(name)) issues.push({code:"duplicate-name",filmId:film.id,detail:`같은 브랜드의 중복 제품명: ${film.name}`});
    names.add(name);
    if (!brandIds.has(film.brandId)) issues.push({code:"orphan-brand",filmId:film.id,detail:`없는 브랜드: ${film.brandId}`});
    if ((film.catalogStatus==="regional-current" || film.availabilityStatus==="regional") && !film.marketRegions?.length) issues.push({code:"regional-no-market",filmId:film.id,detail:`지역 제품인데 marketRegions 없음: ${film.name}`});
    if (film.catalogStatus==="official-current" && !film.sources?.some(source => source.sourceTier==="manufacturer" || source.sourceTier==="official-distributor")) issues.push({code:"official-no-source",filmId:film.id,detail:`공식 현행 표시의 공식 출처 없음: ${film.name}`});
    if ((film.status==="discontinued" || film.availabilityStatus==="discontinued") && film.availabilityStatus==="in-stock") issues.push({code:"discontinued-in-stock",filmId:film.id,detail:`단종과 재고 상태 충돌: ${film.name}`});
    if (unknown(film.manufacturer) && film.dataConfidence==="verified") issues.push({code:"unknown-manufacturer-verified",filmId:film.id,detail:`제조사 미공개인데 Verified: ${film.name}`});
    for (const cameraId of film.usedInCameras||[]) if (!cameraIds.has(cameraId)) issues.push({code:"broken-camera-link",filmId:film.id,detail:`없는 카메라 연결: ${cameraId}`});
    filmById.set(film.id,film);
  }
  for (const camera of cameras) if (camera.linkedFilmId && !filmById.has(camera.linkedFilmId)) issues.push({code:"broken-film-link",detail:`${camera.name} → 없는 필름 ${camera.linkedFilmId}`});
  const missing = canonical.filter(item => !filmById.has(item.id));
  for (const item of missing) issues.push({code:"canonical-missing",filmId:item.id,detail:`마스터 누락: ${item.brandId} ${item.name}`});
  return {
    registeredFilms: films.length, canonicalFilms: canonical.length, registeredBrands: brands.length, registeredCameras: cameras.length,
    missing, issues,
    duplicates: issues.filter(item => item.code.startsWith("duplicate-")),
    unknownStock: films.filter(item => unknown(item.stockOrigin) || unknown(item.manufacturer)),
    unknownAvailability: films.filter(item => item.availabilityStatus==="availability-unknown"),
    regional: films.filter(item => item.catalogStatus==="regional-current" || item.availabilityStatus==="regional"),
    outOfStock: films.filter(item => item.availabilityStatus==="out-of-stock"),
    legacy: films.filter(item => item.catalogStatus==="official-legacy"),
    discontinued: films.filter(item => item.status==="discontinued" || item.availabilityStatus==="discontinued"),
  };
}
