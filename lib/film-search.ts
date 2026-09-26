import type { Film } from "@/data/types";

export function normalizeSearchText(value:string){
  return value.normalize("NFKD").toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu,"");
}

export function filmSearchText(film:Film,brandName:string){
  return [
    brandName,film.name,`ISO ${film.iso}`,film.iso,film.process,film.filmType,
    film.manufacturer,film.stockOrigin,film.sourceStockCode,
    ...(film.searchAliases||[]),...(film.recommendedFor||[]),
    ...(film.practicalProfile?.recommendedUses||[]),...(film.practicalProfile?.recommendedLight||[]),
    film.filmType==="black-and-white"?"black and white blackwhite bw 흑백":"",
  ].filter(Boolean).join(" ");
}

export function matchesFilmSearch(film:Film,brandName:string,query:string){
  const normalizedQuery=normalizeSearchText(query);
  return !normalizedQuery||normalizeSearchText(filmSearchText(film,brandName)).includes(normalizedQuery);
}
