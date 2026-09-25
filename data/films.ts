import { brandById } from "./brands";
import { Film } from "./types";
import { catalogExpansions } from "./catalog-expansion";

type FilmSeed = Omit<Film, "slug" | "brandCountry" | "format" | "grain" | "contrast" | "saturation" | "latitude" | "portrait" | "landscape" | "night" | "beginner" | "uniqueness" | "status" | "dataConfidence" | "catalogStatus" | "availabilityStatus"> & Partial<Pick<Film, "slug" | "grain" | "contrast" | "saturation" | "latitude" | "portrait" | "landscape" | "night" | "beginner" | "uniqueness" | "status" | "dataConfidence" | "catalogStatus" | "availabilityStatus">>;
const officialSource = (brandId: string) => ({name:"브랜드 공식 카탈로그",url:({kodak:"https://www.kodak.com/en/still-film/home/",fujifilm:"https://www.fujifilm.com/jp/ja/consumer/films/negative-and-reversal/jan",ilford:"https://www.ilfordphoto.com/film/",harman:"https://www.harmanphoto.co.uk/harman-colour-film",cinestill:"https://cinestillfilm.com/collections/product-catalog/35mm",lomography:"https://shop.lomography.com/world/film/all",agfaphoto:"https://www.agfaphoto-gtc.com/en/95-photo-film",reto:"https://retoproject.com/collections/shop",filmneverdie:"https://filmneverdie.com/products/filmneverdie-bento-box",flicfilm:"https://flicfilm.ca/",lucky:"https://www.lucky.cn/index/home",manual:"https://shop.manualphoto.com/collections/film"} as Record<string,string>)[brandId],sourceTier:"manufacturer" as const});
const kodakRetailSource = {name:"B&C Camera Kodak 35mm 판매 목록",url:"https://store.bandccamera.com/collections/kodak-35mm-film",sourceTier:"authorized-retailer" as const};
const kodakRetailStatus: Partial<Film> = {catalogStatus:"retail-current",availabilityStatus:"retail-available",availabilityCheckedAt:"2026-09-25",marketRegions:["USA"],sources:[kodakRetailSource]};
const catalogOverrides: Record<string, Partial<Film>> = {
  "kodak-gold-200":{catalogStatus:"official-current",sources:[officialSource("kodak")]},
  "kodak-ultramax-400":{catalogStatus:"official-current",sources:[officialSource("kodak")]},
  "kodak-ektar-100":{catalogStatus:"official-current",sources:[officialSource("kodak")]},
  "kodak-trix-400":{catalogStatus:"official-current",sources:[officialSource("kodak")]},
  "kodak-portra-160":kodakRetailStatus,
  "kodak-portra-400":kodakRetailStatus,
  "kodak-portra-800":kodakRetailStatus,
  "kodak-t-max-100":kodakRetailStatus,
  "kodak-t-max-400":kodakRetailStatus,
  "kodak-t-max-p3200":kodakRetailStatus,
  "kodak-colorplus-200":kodakRetailStatus,
  "kodak-proimage-100":kodakRetailStatus,
  "fujifilm-400":{catalogStatus:"regional-current",marketRegions:["Japan"],sources:[officialSource("fujifilm")]},
  "fujifilm-200":{catalogStatus:"unknown"},
  "ilford-hp5-plus-400":{catalogStatus:"official-current",sources:[officialSource("ilford")]},
  "ilford-xp2-super":{catalogStatus:"official-current",sources:[officialSource("ilford")]},
  "ilford-delta-100":{catalogStatus:"official-current",sources:[officialSource("ilford")]},
  "harman-phoenix-ii-200":{catalogStatus:"official-current",sources:[officialSource("harman")]},
  "cinestill-800t":{catalogStatus:"official-current",sources:[officialSource("cinestill")]},
  "cinestill-400d":{catalogStatus:"official-current",availabilityStatus:"out-of-stock",availabilityCheckedAt:"2026-09-25",sources:[officialSource("cinestill")]},
  "lomography-purple":{catalogStatus:"official-current",sources:[officialSource("lomography")]},
  "lomography-color-400":{catalogStatus:"official-current",sources:[officialSource("lomography")]},
  "lomography-turquoise":{catalogStatus:"official-current",sources:[officialSource("lomography")]},
  "lomography-lomochrome-classicolor-200":{usedInCameras:["lomo-simple-classicolor"]},
  "lomography-lomochrome-metropolis":{usedInCameras:["lomo-simple-metropolis"]},
  "rollei-retro-80s":{catalogStatus:"retail-current",sources:[{name:"Rollei 공식 유통 자료",url:"https://www.macodirect.de/media/pdf/cc/65/94/Retro400_Datenblatt_e.pdf",sourceTier:"official-distributor"}]},
  "agfaphoto-apx-400":{catalogStatus:"official-current",availabilityStatus:"in-stock",availabilityCheckedAt:"2026-09-25",sources:[officialSource("agfaphoto")]},
  "reto-prism-400":{catalogStatus:"official-current",availabilityStatus:"in-stock",availabilityCheckedAt:"2026-09-25",sources:[officialSource("reto")]},
  "filmneverdie-umi-800":{catalogStatus:"official-current",sources:[officialSource("filmneverdie")]},
  "flicfilm-aurora-400":{catalogStatus:"official-current",sources:[officialSource("flicfilm")]},
  "lucky-c200":{catalogStatus:"regional-current",availabilityStatus:"regional",marketRegions:["China"],availabilityCheckedAt:"2026-09-25",sources:[officialSource("lucky")]},
  "manual-mc400":{catalogStatus:"official-current",availabilityStatus:"out-of-stock",availabilityCheckedAt:"2026-09-25",sources:[officialSource("manual")]},
};
const discoveryCollections: Record<string,string[]> = {
  "harman-phoenix-200":["새로운 자체 컬러 유제"],
  "harman-phoenix-ii-200":["2025–2026 신제품","새로운 자체 컬러 유제"],
  "harman-red-125":["2025–2026 신제품","새로운 자체 컬러 유제"],
  "harman-switch-azure-125":["2025–2026 신제품","새로운 자체 컬러 유제"],
  "lomography-lomochrome-classicolor-200":["2025–2026 신제품"],
  "lucky-c400":["2025–2026 신제품"],
  "flicfilm-street-savvy-400":["2025–2026 신제품"],
};
const expansionIds = new Set(catalogExpansions.map(item=>item.id));
const typeDescription:Record<Film["filmType"],string>={"color-negative":"컬러 네거티브","black-and-white":"흑백 네거티브",slide:"슬라이드",redscale:"레드스케일","special-color":"특수 컬러",cinema:"영화용 원판 기반"};
function factualDescription(item:FilmSeed){
  const light=item.balance==="daylight"?" 일광용.":item.balance==="tungsten"?" 텅스텐 조명용.":"";
  const region=item.marketRegions?.length&&item.catalogStatus==="regional-current"?` ${item.marketRegions.join(" · ")} 지역 공식 목록에서 확인됩니다.`:"";
  const origin=!item.manufacturer?" 정확한 원판·제조사는 별도 확인이 필요합니다.":"";
  return `ISO ${item.iso} ${typeDescription[item.filmType]} 필름으로 ${item.process} 현상을 사용합니다.${light}${region}${origin}`;
}
const film = (item: FilmSeed): Film => ({
  slug: item.id, format: "35mm", brandCountry: brandById[item.brandId].country,
  grain: 3, contrast: 3, saturation: 3, latitude: 3, portrait: 3, landscape: 3, night: 2, beginner: 4, uniqueness: 2,
  status: "current", dataConfidence: "likely", catalogStatus:"unknown", availabilityStatus:"availability-unknown", marketRegions:["lomography","manual"].includes(item.brandId)?["Worldwide"]:undefined, ...item, ...catalogOverrides[item.id], description:expansionIds.has(item.id)&&item.description.endsWith("제조 및 판매 정보는 연결된 출처와 확인 날짜를 기준으로 표시합니다.")?factualDescription(item):item.description, collectionTags:discoveryCollections[item.id]||item.collectionTags, profileEstimated:expansionIds.has(item.id),
});

export const films: Film[] = [
  film({ id:"kodak-gold-200", brandId:"kodak", name:"Gold 200", iso:200, filmType:"color-negative", process:"C-41", balance:"daylight", dxCode:true, manufacturer:"Eastman Kodak", manufacturerCountry:"미국", stockOrigin:"Kodak Gold", manufacturingType:"manufacturer", grain:4, saturation:4, latitude:4, portrait:4, landscape:5, beginner:5, colorProfile:["#e8b24e","#d97b4b","#b95143","#7594ab"], description:"따뜻한 노랑과 오렌지 톤이 돋보이는 대표적인 데일리 컬러 필름.", recommendedFor:["여행","일상","맑은 날","빈티지"], dataConfidence:"verified" }),
  film({ id:"kodak-portra-400", brandId:"kodak", name:"Portra 400", iso:400, filmType:"color-negative", process:"C-41", balance:"daylight", dxCode:true, manufacturer:"Eastman Kodak", manufacturerCountry:"미국", stockOrigin:"Kodak Portra", manufacturingType:"manufacturer", grain:4, contrast:2, saturation:2, latitude:5, portrait:5, landscape:4, beginner:4, colorProfile:["#d5ad8d","#bd8b78","#8a9b93","#9aa5b0"], description:"부드러운 피부 톤과 넓은 노출 관용도로 사랑받는 컬러 네거티브.", recommendedFor:["인물","여행","일상"], dataConfidence:"verified" }),
  film({ id:"kodak-ultramax-400", brandId:"kodak", name:"UltraMax 400", iso:400, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturer:"Eastman Kodak", manufacturerCountry:"미국", manufacturingType:"manufacturer", grain:3, contrast:4, saturation:4, latitude:4, portrait:4, landscape:4, night:3, colorProfile:["#e6a84f","#d16a4e","#5e8fba"], description:"실내외를 두루 담기 편한 ISO 400 컬러 필름.", recommendedFor:["일상","여행","스트리트"], dataConfidence:"verified" }),
  film({ id:"kodak-colorplus-200", brandId:"kodak", name:"ColorPlus 200", iso:200, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturer:"Eastman Kodak", manufacturingType:"manufacturer", grain:3, contrast:3, saturation:3, latitude:3, colorProfile:["#e6bc6f","#c4775f","#6e9cb0"], description:"편안하고 향수 어린 색감의 입문용 컬러 필름.", recommendedFor:["일상","빈티지","맑은 날"], dataConfidence:"likely" }),
  film({ id:"kodak-proimage-100", brandId:"kodak", name:"Pro Image 100", iso:100, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturer:"Eastman Kodak", manufacturingType:"manufacturer", grain:4, contrast:3, saturation:3, latitude:4, landscape:4, colorProfile:["#d9b879","#ad8972","#789bb4"], description:"고운 입자와 자연스러운 색의 저감도 컬러 네거티브.", recommendedFor:["인물","풍경","맑은 날"] }),
  film({ id:"kodak-ektar-100", brandId:"kodak", name:"Ektar 100", iso:100, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturer:"Eastman Kodak", manufacturingType:"manufacturer", grain:5, contrast:4, saturation:5, latitude:3, landscape:5, colorProfile:["#d75242","#e4ad44","#4a86a2"], description:"선명한 색과 매우 고운 입자가 특징인 풍경용 필름.", recommendedFor:["풍경","여행","맑은 날"], dataConfidence:"verified" }),
  film({ id:"kodak-trix-400", brandId:"kodak", name:"TRI-X 400", iso:400, filmType:"black-and-white", process:"B&W", manufacturer:"Eastman Kodak", manufacturingType:"manufacturer", grain:2, contrast:4, latitude:4, portrait:4, night:3, uniqueness:4, colorProfile:["#252e38","#7c858d","#d5d4ce"], description:"또렷한 대비와 살아 있는 입자의 클래식 흑백 필름.", recommendedFor:["흑백","스트리트","인물"], usedInCameras:["kodak-400tx-single-use"], dataConfidence:"verified" }),
  film({ id:"fujifilm-400", brandId:"fujifilm", name:"400", iso:400, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturingType:"oem", manufacturer:"공개 정보 제한", stockOrigin:"공개 정보 제한", grain:3, contrast:3, saturation:3, latitude:4, colorProfile:["#74a889","#d6b781","#829fb2"], description:"일상과 여행에 편한 ISO 400 컬러 필름. 생산 시기·시장에 따라 원판 정보가 다를 수 있습니다.", recommendedFor:["일상","여행","첫 필름"], dataConfidence:"unknown" }),
  film({ id:"fujifilm-200", brandId:"fujifilm", name:"200", iso:200, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturingType:"oem", stockOrigin:"공개 정보 제한", colorProfile:["#8db092","#d8bb82","#759abc"], description:"햇빛 아래에서 쓰기 좋은 ISO 200 컬러 네거티브. 원판은 제품별로 확인이 필요합니다.", recommendedFor:["맑은 날","여행"], dataConfidence:"unknown" }),
  film({ id:"ilford-hp5-plus-400", brandId:"ilford", name:"HP5 PLUS 400", iso:400, filmType:"black-and-white", process:"B&W", manufacturer:"HARMAN technology", manufacturerCountry:"영국", manufacturingType:"manufacturer", grain:3, contrast:3, latitude:5, portrait:5, landscape:4, night:3, beginner:5, colorProfile:["#22282d","#8e9699","#e0ddd3"], description:"넓은 노출 관용도와 유연한 증감 현상으로 사랑받는 흑백 필름.", recommendedFor:["흑백","인물","스트리트","첫 필름"], usedInCameras:["ilford-hp5-single-use"], dataConfidence:"verified", sources:[{name:"ILFORD 제품 브로슈어",url:"https://www.ilfordphoto.com/wp/wp-content/uploads/2017/05/Ilford-Product-Brochure-LOW-RES-WEB-1.pdf"}] }),
  film({ id:"ilford-xp2-super", brandId:"ilford", name:"XP2 SUPER 400", iso:400, filmType:"black-and-white", process:"C-41", manufacturer:"HARMAN technology", manufacturerCountry:"영국", manufacturingType:"manufacturer", grain:4, contrast:3, latitude:5, portrait:4, beginner:5, colorProfile:["#262d32","#929b9d","#e1dfda"], description:"일반 C-41 컬러 현상소에서 처리할 수 있는 흑백 필름.", recommendedFor:["흑백","여행","첫 필름"], usedInCameras:["ilford-xp2-single-use"], dataConfidence:"verified" }),
  film({ id:"ilford-delta-100", brandId:"ilford", name:"DELTA 100", iso:100, filmType:"black-and-white", process:"B&W", manufacturer:"HARMAN technology", manufacturerCountry:"영국", manufacturingType:"manufacturer", grain:5, contrast:3, latitude:3, portrait:4, landscape:5, colorProfile:["#30383b","#a1a7a4","#e8e5dd"], description:"세밀한 표현에 강한 저감도 흑백 필름.", recommendedFor:["흑백","풍경","인물"], dataConfidence:"verified" }),
  film({ id:"harman-phoenix-ii-200", brandId:"harman", name:"Phoenix II 200", iso:200, filmType:"color-negative", process:"C-41", manufacturer:"HARMAN technology", manufacturerCountry:"영국", manufacturingType:"manufacturer", contrast:4, saturation:4, latitude:2, uniqueness:5, colorProfile:["#e78452","#d6a654","#658d9a"], description:"HARMAN이 선보인 개성 강한 컬러 네거티브의 두 번째 세대.", recommendedFor:["실험","빈티지","스트리트"], dataConfidence:"verified" }),
  film({ id:"cinestill-800t", brandId:"cinestill", name:"800T", iso:800, filmType:"cinema", process:"C-41", balance:"tungsten", stockOrigin:"영화용 텅스텐 컬러 네거티브", manufacturingType:"cinema-conversion", manufacturer:"원판 제조사 공개 정보 확인 필요", grain:3, contrast:4, saturation:4, night:5, uniqueness:5, beginner:2, colorProfile:["#245976","#aa4e4e","#e2a75e"], description:"렘젯을 제거한 영화용 원판 기반 필름. 인공조명과 네온에서 독특한 할레이션을 만듭니다.", recommendedFor:["야경","네온","영화 같은 느낌"], dataConfidence:"likely" }),
  film({ id:"cinestill-400d", brandId:"cinestill", name:"400D", iso:400, filmType:"cinema", process:"C-41", balance:"daylight", stockOrigin:"영화용 데이라이트 컬러 네거티브", manufacturingType:"cinema-conversion", latitude:4, portrait:4, night:3, uniqueness:4, colorProfile:["#d2ad79","#c27564","#7092a3"], description:"영화 같은 톤과 유연한 노출을 지향하는 데이라이트 필름.", recommendedFor:["인물","여행","영화 같은 느낌"], dataConfidence:"likely" }),
  film({ id:"lomography-purple", brandId:"lomography", name:"Lomochrome Purple", iso:400, exposureIndex:"ISO 100–400", filmType:"special-color", process:"C-41", manufacturingType:"oem", stockOrigin:"공개되지 않음", grain:3, contrast:4, saturation:5, uniqueness:5, beginner:2, colorProfile:["#7b58a2","#b75e95","#61997d"], description:"녹색이 보라색으로 바뀌는 실험적인 컬러 필름.", recommendedFor:["특수 색감","실험","풍경"], usedInCameras:["lomo-simple-purple"], dataConfidence:"unknown" }),
  film({ id:"lomography-color-400", brandId:"lomography", name:"Color Negative 400", iso:400, filmType:"color-negative", process:"C-41", manufacturingType:"oem", stockOrigin:"공개되지 않음", contrast:4, saturation:4, colorProfile:["#e0ae70","#c47761","#6e9aac"], description:"일상에 쓰기 편한 생생한 컬러 네거티브.", recommendedFor:["일상","여행","스트리트"], usedInCameras:["lomo-simple-color"], dataConfidence:"unknown" }),
  film({ id:"lomography-turquoise", brandId:"lomography", name:"Lomochrome Turquoise", iso:400, exposureIndex:"ISO 100–400", filmType:"special-color", process:"C-41", manufacturingType:"oem", stockOrigin:"공개되지 않음", saturation:5, uniqueness:5, beginner:2, colorProfile:["#3e9eaa","#d48955","#e6ca73"], description:"하늘과 피부색을 예상 밖의 팔레트로 바꾸는 특수 컬러.", recommendedFor:["특수 색감","실험"], usedInCameras:["lomo-simple-turquoise"], dataConfidence:"unknown" }),
  film({ id:"rollei-retro-80s", brandId:"rollei", name:"Retro 80S", iso:80, filmType:"black-and-white", process:"B&W", manufacturingType:"oem", stockOrigin:"공개 정보 제한", grain:5, contrast:4, latitude:2, landscape:5, colorProfile:["#272e35","#899194","#d4d8d5"], description:"미세한 입자와 높은 선명도의 저감도 흑백 필름.", recommendedFor:["흑백","풍경"], dataConfidence:"unknown" }),
  film({ id:"agfaphoto-apx-400", brandId:"agfaphoto", name:"APX 400", iso:400, filmType:"black-and-white", process:"B&W", manufacturingType:"oem", stockOrigin:"공개 정보 제한", contrast:3, latitude:4, colorProfile:["#303235","#8b8d8e","#dedfda"], description:"다양한 빛에서 쓰기 좋은 범용 흑백 필름.", recommendedFor:["흑백","스트리트"], usedInCameras:["agfa-lebox-bw"], dataConfidence:"likely" }),
  film({ id:"reto-prism-400", brandId:"reto", name:"Retocolor Prism 400", iso:400, filmType:"special-color", process:"C-41", manufacturingType:"oem", stockOrigin:"공개되지 않음", saturation:5, uniqueness:5, colorProfile:["#7f66b6","#c36b93","#67a9a3"], description:"색의 변주를 즐기는 RETO의 특수 컬러 필름.", recommendedFor:["특수 색감","실험"], usedInCameras:["reto-prism-disposable"], dataConfidence:"unknown" }),
  film({ id:"filmneverdie-umi-800", brandId:"filmneverdie", name:"UMI 800", iso:800, filmType:"color-negative", process:"C-41", manufacturingType:"oem", stockOrigin:"공개되지 않음", night:4, colorProfile:["#e2a263","#bd6857","#536f8e"], description:"높은 감도로 저녁의 일상도 담을 수 있는 컬러 필름.", recommendedFor:["실내","야경","스트리트"], usedInCameras:["fnd-umi-800-single-use"], dataConfidence:"unknown" }),
  film({ id:"flicfilm-aurora-400", brandId:"flicfilm", name:"Aurora 400", iso:400, filmType:"color-negative", process:"C-41", manufacturingType:"respooled", stockOrigin:"공개 정보 제한", latitude:4, colorProfile:["#e0a766","#ba7463","#688da3"], description:"부드러운 일상 색감을 지향하는 캐나다 브랜드의 ISO 400 필름.", recommendedFor:["일상","여행","인물"], dataConfidence:"unknown" }),
  film({ id:"escura-vintage-400", brandId:"escura", name:"Vintage 400", iso:400, filmType:"color-negative", process:"C-41", manufacturingType:"oem", stockOrigin:"공개되지 않음", colorProfile:["#c99f77","#af7168","#82939a"], description:"원판이 공개되지 않은 빈티지 톤 컬러 필름.", recommendedFor:["빈티지","일상"], dataConfidence:"unknown" }),
  film({ id:"hitchcock-500t", brandId:"hitchcock", name:"500T", iso:500, filmType:"cinema", process:"ECN-2", balance:"tungsten", manufacturingType:"respooled", stockOrigin:"영화용 텅스텐 원판 · 정확한 제품 미공개", night:5, uniqueness:4, colorProfile:["#3a6184","#a2575a","#deb078"], description:"시네마 톤을 지향하는 텅스텐 필름. 구체적인 원판은 확인이 필요합니다.", recommendedFor:["야경","네온","영화 같은 느낌"], status:"limited", dataConfidence:"unknown" }),
  film({ id:"vibe-400", brandId:"vibe", name:"400", iso:400, filmType:"color-negative", process:"C-41", manufacturingType:"unknown", stockOrigin:"공개되지 않음", colorProfile:["#d6aa72","#b57868","#6d8a9a"], description:"원판 정보가 공개되지 않은 독립 브랜드 컬러 필름.", recommendedFor:["일상","여행"], dataConfidence:"unknown" }),
  film({ id:"lucky-c200", brandId:"lucky", name:"C200", iso:200, filmType:"color-negative", process:"C-41", balance:"daylight", manufacturer:"Lucky Film", manufacturerCountry:"중국", manufacturingType:"manufacturer", contrast:3, saturation:3, colorProfile:["#d8ae74","#ba6d5c","#6992a5"], description:"중국 Lucky Film의 데이라이트 컬러 네거티브.", recommendedFor:["여행","일상","맑은 날"], dataConfidence:"likely" }),
  film({ id:"manual-mc400", brandId:"manual", name:"MC400", iso:400, filmType:"cinema", process:"C-41", balance:"daylight", manufacturingType:"cinema-conversion", stockOrigin:"영화용 컬러 네거티브 · 정확한 원판 미공개", contrast:4, saturation:3, night:3, uniqueness:4, colorProfile:["#d5a67b","#af7165","#688998"], description:"도시의 빛과 그림자를 담는 시네마 감성 컬러 필름. 정확한 원판은 공개 정보가 제한적입니다.", recommendedFor:["스트리트","영화 같은 느낌","일상"], dataConfidence:"unknown", sources:[{name:"Manual MC400 제품 정보",url:"https://shop.manualphoto.com/products/manual-mc400-35mm-film-single"}] }),
  ...catalogExpansions.map(film),
];

export const filmById = Object.fromEntries(films.map((item) => [item.id, item])) as Record<string, Film>;
