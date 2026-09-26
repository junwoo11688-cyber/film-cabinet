import type { Brand, Camera, Film } from "../data/types";
import type { CanonicalFilm } from "../data/master-catalog";

export type AuditIssue = { code: string; filmId?: string; cameraId?: string; detail: string; severity?: "error" | "warning" };
const unknown = (value?: string) => !value || /unknown|공개|미상|불명/i.test(value);
const productKey = (film: Pick<Film, "brandId" | "name">) => `${film.brandId}:${film.name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9가-힣]/g, "")}`;

export function auditCatalog(films: Film[], brands: Brand[], cameras: Camera[], canonical: CanonicalFilm[]) {
  const issues: AuditIssue[] = [];
  const filmById = new Map<string, Film>();
  const ids = new Set<string>(), slugs = new Set<string>(), names = new Set<string>();
  const brandIds = new Set(brands.map(item => item.id));
  const cameraIds = new Set(cameras.map(item => item.id));
  const missingSources: Film[] = [];
  const seenBrandIds=new Set<string>(), seenBrandSlugs=new Set<string>();
  for(const brand of brands){
    const slug=brand.slug||brand.id;
    if(seenBrandIds.has(brand.id))issues.push({code:"duplicate-brand-id",detail:`중복 브랜드 ID: ${brand.id}`});
    if(seenBrandSlugs.has(slug))issues.push({code:"duplicate-brand-slug",detail:`중복 브랜드 slug: ${slug}`});
    seenBrandIds.add(brand.id);seenBrandSlugs.add(slug);
  }
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
    if (!film.sources?.length) missingSources.push(film);
    if (film.catalogStatus==="official-current" && !film.sources?.some(source => source.sourceTier==="manufacturer" || source.sourceTier==="official-brand" || source.sourceTier==="official-distributor")) issues.push({code:"official-no-source",filmId:film.id,detail:`공식 현행 표시의 공식 출처 없음: ${film.name}`,severity:"warning"});
    if ((film.status==="discontinued" || film.availabilityStatus==="discontinued") && film.availabilityStatus==="in-stock") issues.push({code:"discontinued-in-stock",filmId:film.id,detail:`단종과 재고 상태 충돌: ${film.name}`});
    if (film.manufacturingType==="manufacturer" && unknown(film.manufacturer) && film.dataConfidence==="verified") issues.push({code:"unknown-manufacturer-verified",filmId:film.id,detail:`직접 제조로 Verified 처리됐지만 제조사가 없음: ${film.name}`});
    if (film.photographyUse==="motion-picture" && film.packagingType==="135-cartridge") issues.push({code:"motion-135-contradiction",filmId:film.id,detail:`모션 원본 재고가 135 카트리지로 표시됨: ${film.name}`});
    if (film.comingSoon && ["in-stock","retail-available","regional"].includes(film.availabilityStatus)) issues.push({code:"coming-soon-in-stock",filmId:film.id,detail:`개발 중 제품과 판매 상태 충돌: ${film.name}`});
    if (film.derivedFromFilmId && !films.some(candidate=>candidate.id===film.derivedFromFilmId)) issues.push({code:"broken-derived-link",filmId:film.id,detail:`없는 원본 필름 연결: ${film.derivedFromFilmId}`});
    for (const cameraId of film.usedInCameras||[]) if (!cameraIds.has(cameraId)) issues.push({code:"broken-camera-link",filmId:film.id,detail:`없는 카메라 연결: ${cameraId}`});
    filmById.set(film.id,film);
  }
  const cameraSlugs = new Set<string>(), seenCameraIds=new Set<string>();
  for (const camera of cameras) {
    const slug=camera.slug||camera.id;
    if (seenCameraIds.has(camera.id)) issues.push({code:"duplicate-camera-id",cameraId:camera.id,detail:`중복 카메라 ID: ${camera.id}`});
    if (cameraSlugs.has(slug)) issues.push({code:"duplicate-camera-slug",cameraId:camera.id,detail:`중복 카메라 slug: ${slug}`});
    seenCameraIds.add(camera.id);cameraSlugs.add(slug);
    if(!brandIds.has(camera.brandId)) issues.push({code:"orphan-camera-brand",cameraId:camera.id,detail:`${camera.name} → 없는 브랜드 ${camera.brandId}`});
    if (camera.linkedFilmId && !filmById.has(camera.linkedFilmId)) issues.push({code:"broken-film-link",cameraId:camera.id,detail:`${camera.name} → 없는 필름 ${camera.linkedFilmId}`});
    if (camera.frameFormat==="half-frame" && camera.exposures>0 && camera.exposures<48) issues.push({code:"half-frame-exposure-warning",cameraId:camera.id,detail:`하프프레임 노출 수 재확인 필요: ${camera.name} ${camera.exposures}컷`,severity:"warning"});
  }
  const missing = canonical.filter(item => !filmById.has(item.id));
  for (const item of missing) issues.push({code:"canonical-missing",filmId:item.id,detail:`마스터 누락: ${item.brandId} ${item.name}`});
  const known=<T,>(value:T|"unknown"|undefined)=>value!==undefined&&value!=="unknown";
  const practicalCoverage={
    profile:films.filter(item=>!!item.practicalProfile),
    grain:films.filter(item=>known(item.practicalProfile?.grain)),
    contrast:films.filter(item=>known(item.practicalProfile?.contrast)),
    saturation:films.filter(item=>known(item.practicalProfile?.saturation)),
    latitude:films.filter(item=>known(item.practicalProfile?.latitude)),
    recommendedUses:films.filter(item=>!!item.practicalProfile?.recommendedUses?.length),
  };
  const technicalCoverage={
    dx:films.filter(item=>known(item.dxCoding)),
    exposures:films.filter(item=>!!item.availableExposures?.length),
    colorBalance:films.filter(item=>known(item.colorBalance)),
    remjet:films.filter(item=>known(item.remjet)),
    pushPull:films.filter(item=>item.pushPull?.officialSupport==="yes"||item.pushPull?.officialSupport==="no"),
    irOrtho:films.filter(item=>known(item.irSensitivity)||known(item.orthochromatic)),
  };
  return {
    registeredFilms: films.length, canonicalFilms: canonical.length, registeredBrands: brands.length, registeredCameras: cameras.length,
    missing, issues,
    duplicates: issues.filter(item => item.code.startsWith("duplicate-")),
    unknownStock: films.filter(item => item.manufacturingType !== "manufacturer" && (unknown(item.stockOrigin) || unknown(item.manufacturer))),
    unknownAvailability: films.filter(item => item.availabilityStatus==="availability-unknown"),
    regional: films.filter(item => item.catalogStatus==="regional-current" || item.availabilityStatus==="regional"),
    outOfStock: films.filter(item => item.availabilityStatus==="out-of-stock"),
    legacy: films.filter(item => item.catalogStatus==="official-legacy"),
    discontinued: films.filter(item => item.status==="discontinued" || item.availabilityStatus==="discontinued"),
    still: films.filter(item => (item.photographyUse||"still")==="still"),
    motion: films.filter(item => item.photographyUse==="motion-picture"),
    effect: films.filter(item => item.filmCategory==="effect" || item.filmCategory==="pre-exposed"),
    industrial: films.filter(item => item.photographyUse==="industrial" || item.filmCategory==="industrial" || item.industrialStock),
    limited: films.filter(item => item.limitedEdition || item.catalogStatus==="limited"),
    comingSoon: films.filter(item => item.comingSoon || item.catalogStatus==="in-development"),
    missingSources,
    practicalCoverage,
    technicalCoverage,
  };
}
