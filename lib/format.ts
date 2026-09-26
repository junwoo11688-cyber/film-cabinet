import { Camera, Confidence, Film, FilmType, ManufacturingType, CatalogStatus, FilmAvailability, PhotographyUse, PackagingType, FilmCategory, Treatment } from "@/data/types";

export const filmTypeLabel: Record<FilmType, string> = {
  "color-negative":"컬러 네거티브", "black-and-white":"흑백 네거티브", slide:"슬라이드",
  redscale:"Redscale", "special-color":"특수 컬러", cinema:"시네마 필름",
};
export const filmTypeShort: Record<FilmType, string> = {
  "color-negative":"COLOR", "black-and-white":"B&W", slide:"SLIDE", redscale:"REDSCALE",
  "special-color":"SPECIAL", cinema:"CINEMA",
};
export const manufacturingLabel: Record<ManufacturingType, string> = {
  manufacturer:"직접 제조사", oem:"OEM", respooled:"리스풀", "cinema-conversion":"시네마 필름 가공", unknown:"원판 비공개",
};
export const confidenceLabel: Record<Confidence, string> = {
  verified:"✓ VERIFIED", likely:"△ LIKELY", unknown:"? UNKNOWN",
};
export const catalogStatusLabel: Record<CatalogStatus,string> = {
  "official-current":"OFFICIAL CURRENT","official-legacy":"LEGACY","retail-current":"RETAIL CURRENT","regional-current":"REGIONAL CURRENT",limited:"LIMITED","in-development":"IN DEVELOPMENT",unknown:"CATALOG UNKNOWN",
};
export const photographyUseLabel:Record<PhotographyUse,string>={still:"Still Photography","motion-picture":"Motion Picture",industrial:"Industrial / Special","multi-purpose":"Multi-purpose"};
export const packagingTypeLabel:Record<PackagingType,string>={"135-cartridge":"135 Cartridge","35mm-motion-bulk":"35mm Motion Bulk","35mm-bulk":"35mm Bulk",other:"Other"};
export const filmCategoryLabel:Record<FilmCategory,string>={standard:"Standard",cinema:"Cinema",effect:"Effect","pre-exposed":"Pre-exposed",redscale:"Red Scale",infrared:"Infrared",ortho:"Ortho",industrial:"Industrial","special-purpose":"Special Purpose"};
export const treatmentLabel:Record<Treatment,string>={none:"None","remjet-removed":"Rem-jet removed",ahu:"AHU","pre-exposed":"Pre-exposed","color-tinted":"Color-tinted",redscale:"Redscale","special-effect":"Special effect"};
export const filmAvailabilityLabel: Record<FilmAvailability,string> = {
  "in-stock":"IN STOCK","out-of-stock":"OUT OF STOCK",preorder:"PREORDER","retail-available":"RETAIL AVAILABLE",regional:"REGIONAL","availability-unknown":"AVAILABILITY UNKNOWN",discontinued:"DISCONTINUED",
};
export const buyableAvailability: FilmAvailability[] = ["in-stock","retail-available","regional","preorder"];
export const filmAvailabilityFilters = ["전체","현재 구매 가능","공식 현행","소매 유통","예약 판매","지역 한정","품절","판매상태 확인 필요","한정판","개발 중","레거시","단종"] as const;
export function matchesFilmAvailability(film:Film,filter:string){
  switch(filter){
    case "전체":return true;
    case "현재 구매 가능":return buyableAvailability.includes(film.availabilityStatus);
    case "공식 현행":return film.catalogStatus==="official-current";
    case "소매 유통":return film.catalogStatus==="retail-current"||film.availabilityStatus==="retail-available";
    case "예약 판매":return film.availabilityStatus==="preorder";
    case "지역 한정":return film.catalogStatus==="regional-current"||film.availabilityStatus==="regional";
    case "품절":return film.availabilityStatus==="out-of-stock";
    case "판매상태 확인 필요":return film.availabilityStatus==="availability-unknown";
    case "한정판":return film.catalogStatus==="limited"||!!film.limitedEdition;
    case "개발 중":return film.catalogStatus==="in-development"||!!film.comingSoon;
    case "레거시":return film.catalogStatus==="official-legacy";
    case "단종":return film.status==="discontinued"||film.availabilityStatus==="discontinued";
    default:return true;
  }
}
export const cameraTypeLabel: Record<Camera["cameraType"], string> = {
  "single-use":"Single Use", "preloaded-reusable":"Preloaded Reusable", reusable:"Reusable",
};
export const stockLabel: Record<Camera["stockStatus"], string> = {
  "commercial-film":"AVAILABLE AS ROLL", "camera-exclusive":"CAMERA EXCLUSIVE",
  "unknown-stock":"STOCK UNKNOWN", "pre-exposed-effect":"PRE-EXPOSED EFFECT",
};
export const availabilityLabel: Record<Camera["standaloneFilmAvailability"], string> = {
  available:"별도 구매 가능", unavailable:"동일한 일반 롤 확인되지 않음", unknown:"별도 판매 정보 미확인",
};
export const scoreLabels: { key: keyof Film; label: string }[] = [
  {key:"grain",label:"입자 고움"},{key:"contrast",label:"콘트라스트"},{key:"saturation",label:"채도"},
  {key:"latitude",label:"노출 관용도"},{key:"portrait",label:"인물"},{key:"landscape",label:"풍경"},
  {key:"night",label:"야간"},{key:"beginner",label:"입문 난이도"},{key:"uniqueness",label:"개성"},
];
export const isoBand = (iso: number) => iso === 0 ? "필름에 따라 다름" : iso <= 25 ? "25 이하" : iso === 50 ? "50" : iso <= 100 ? "80–100" : iso <= 200 ? "125–200" : iso <= 400 ? "250–400" : iso <= 800 ? "500–800" : "1600 이상";
export const cameraIso = (iso:number) => iso === 0 ? "필름에 따라 다름" : `ISO ${iso}`;
export const cameraExposures = (exposures:number) => exposures === 0 ? "필름에 따라 다름" : `${exposures}컷`;
