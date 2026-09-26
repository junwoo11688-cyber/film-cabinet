import type { Film, RecommendedLight, RecommendedUse } from "@/data/types";

export type ShootingChoice = "portrait" | "street" | "landscape" | "travel" | "indoor" | "night" | "experimental" | "any";
export type LightChoice = "bright-daylight" | "overcast" | "indoor" | "night" | "tungsten" | "any";
export type LookChoice = "natural" | "vivid" | "soft" | "vintage" | "cinema" | "experimental" | "bw";
export type RecommendationCriteria = {shooting:ShootingChoice;light:LightChoice;look:LookChoice};
export type FilmRecommendation = {film:Film;score:number;reasons:string[]};

const available = new Set(["in-stock","retail-available","regional"]);
const experimentalCategories = new Set(["effect","pre-exposed","redscale"]);

export function isRecommendationEligible(film:Film,allowExperimental=false){
  if(film.packagingType!=="135-cartridge")return false;
  if(film.photographyUse==="motion-picture"||film.photographyUse==="industrial")return false;
  if(film.filmCategory==="industrial"||film.filmCategory==="special-purpose")return false;
  if(film.comingSoon||film.catalogStatus==="in-development"||film.catalogStatus==="official-legacy")return false;
  if(film.status==="discontinued"||film.availabilityStatus==="discontinued"||film.availabilityStatus==="out-of-stock")return false;
  if(!allowExperimental&&experimentalCategories.has(film.filmCategory||"standard"))return false;
  return available.has(film.availabilityStatus)||(film.availabilityStatus==="availability-unknown"&&film.catalogStatus!=="unknown");
}

function recommendedUseFor(choice:ShootingChoice):RecommendedUse|undefined{
  return choice==="any"||choice==="experimental"?undefined:choice;
}
function lightFor(choice:LightChoice):RecommendedLight|undefined{
  return choice==="any"?undefined:choice;
}

function isoFit(film:Film,light:LightChoice){
  if(light==="bright-daylight")return film.iso<=200?4:film.iso<=400?1:-2;
  if(light==="overcast")return film.iso>=200&&film.iso<=800?4:0;
  if(light==="indoor"||light==="night"||light==="tungsten")return film.iso>=800?5:film.iso>=400?3:-2;
  return 0;
}

function scoreFilm(film:Film,criteria:RecommendationCriteria):FilmRecommendation{
  const profile=film.practicalProfile;
  const reasons:string[]=[];
  let score=available.has(film.availabilityStatus)?8:2;
  if(film.filmType==="black-and-white"&&["natural","vivid","vintage"].includes(criteria.look))score-=20;
  const requestedUse=recommendedUseFor(criteria.shooting);
  const requestedLight=lightFor(criteria.light);

  if(requestedUse&&profile?.recommendedUses?.includes(requestedUse)){
    score+=8;reasons.push(`${requestedUseLabel[requestedUse]} 촬영 용도가 공식·검증 프로필에 포함됩니다.`);
  }
  if(criteria.shooting==="experimental"&&experimentalCategories.has(film.filmCategory||"standard")){
    score+=10;reasons.push(`${film.filmCategory==="redscale"?"레드스케일":"효과"} 필름이라 실험적인 결과를 의도할 수 있습니다.`);
  }
  if(requestedLight&&profile?.recommendedLight?.includes(requestedLight)){
    score+=7;reasons.push(`${lightLabel[requestedLight]} 환경이 권장 조명에 포함됩니다.`);
  }
  const lightScore=isoFit(film,criteria.light);score+=lightScore;
  if(lightScore>=4)reasons.push(`ISO ${film.iso} 감도가 선택한 빛 조건에 대응하기 좋습니다.`);

  switch(criteria.look){
    case "natural":
      if(profile?.saturation==="natural"){score+=8;reasons.push("검증 프로필이 자연스러운 채도로 분류됩니다.");}
      if(profile?.contrast==="low"||profile?.contrast==="medium")score+=2;
      break;
    case "vivid":
      if(profile?.saturation==="vivid"){score+=9;reasons.push("검증 프로필이 선명한 채도로 분류됩니다.");}
      break;
    case "soft":
      if(profile?.contrast==="low"){score+=7;reasons.push("낮은 대비의 부드러운 프로필입니다.");}
      if(profile?.grain==="fine")score+=3;
      break;
    case "vintage":
      if(film.recommendedFor.some(value=>value.includes("빈티지"))){score+=7;reasons.push("등록된 추천 용도에 빈티지 표현이 포함됩니다.");}
      if(profile?.grain==="pronounced")score+=3;
      break;
    case "cinema":
      if(film.filmCategory==="cinema"||film.manufacturingType==="cinema-conversion"||profile?.recommendedUses?.includes("cinema-look")){score+=9;reasons.push("시네마 계열 또는 cinema-look 용도로 검증된 필름입니다.");}
      break;
    case "experimental":
      if(experimentalCategories.has(film.filmCategory||"standard")||profile?.saturation==="experimental"){score+=10;reasons.push("효과·실험 카테고리의 필름입니다.");}
      break;
    case "bw":
      if(film.filmType==="black-and-white"){score+=12;reasons.push("선택한 흑백 룩에 맞는 B&W 필름입니다.");}else score-=30;
      break;
  }
  if(profile?.latitude==="wide"){score+=3;reasons.push("넓은 노출 관용도가 문서화되어 있습니다.");}
  if(profile?.profileConfidence==="verified")score+=2;
  return {film,score,reasons:Array.from(new Set(reasons)).slice(0,3)};
}

export function recommendFilms(films:Film[],criteria:RecommendationCriteria,limit=3){
  const allowExperimental=criteria.look==="experimental"||criteria.look==="cinema"||criteria.shooting==="experimental";
  return films
    .filter(film=>isRecommendationEligible(film,allowExperimental))
    .map(film=>scoreFilm(film,criteria))
    .filter(result=>criteria.look!=="bw"||result.film.filmType==="black-and-white")
    .sort((a,b)=>b.score-a.score||a.film.id.localeCompare(b.film.id))
    .slice(0,limit);
}

export function surpriseFilmPool(films:Film[]){
  return films.filter(film=>isRecommendationEligible(film,false)&&film.filmCategory!=="cinema");
}

export const useLabel:Record<ShootingChoice,string>={portrait:"인물",street:"거리",landscape:"풍경",travel:"여행",indoor:"실내",night:"밤",experimental:"실험",any:"아무거나"};
export const lightChoiceLabel:Record<LightChoice,string>={"bright-daylight":"밝은 낮",overcast:"흐림",indoor:"실내",night:"야간",tungsten:"텅스텐 / 전구빛",any:"잘 모르겠음"};
export const lookLabel:Record<LookChoice,string>={natural:"자연스럽게",vivid:"선명하고 컬러풀하게",soft:"부드럽게",vintage:"빈티지하게",cinema:"시네마 느낌",experimental:"실험적으로",bw:"흑백"};
const requestedUseLabel:Record<RecommendedUse,string>={portrait:"인물",street:"거리",landscape:"풍경",travel:"여행",everyday:"일상",indoor:"실내",night:"야간",architecture:"건축",experimental:"실험", "cinema-look":"시네마 룩"};
const lightLabel:Record<RecommendedLight,string>={"bright-daylight":"밝은 낮",daylight:"일광",overcast:"흐린 날",indoor:"실내",tungsten:"텅스텐", "mixed-light":"혼합광",night:"야간",flash:"플래시"};
