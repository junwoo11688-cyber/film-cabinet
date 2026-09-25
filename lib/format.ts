import { Camera, Confidence, Film, FilmType, ManufacturingType } from "@/data/types";

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
  verified:"✓ 제조사 공개 정보", likely:"△ 일부 정보 제한", unknown:"? 원판·제조사 비공개",
};
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
