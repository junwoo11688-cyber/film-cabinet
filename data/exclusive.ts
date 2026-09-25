export type ExclusiveEntry={id:string;name:string;brandId:string;cameraIds:string[];description:string;kind:"exclusive"|"unknown"|"available";linkedFilmId?:string};

export const exclusiveEntries:ExclusiveEntry[]=[
  {id:"kodak-single-use-800",name:"Kodak Single-Use ISO 800 Color",brandId:"kodak",cameraIds:["kodak-funsaver","kodak-power-flash","kodak-daylight","kodak-sport"],description:"Kodak 일회용 카메라에 들어가는 ISO 800 컬러 필름. 동일한 일반 135 롤 제품은 확인되지 않습니다.",kind:"exclusive"},
  {id:"fujifilm-quicksnap-bw-400",name:"QuickSnap Black & White 400",brandId:"fujifilm",cameraIds:["fujifilm-quicksnap-bw"],description:"C-41로 현상하는 QuickSnap 내장 흑백 필름. 동일한 일반 롤 제품은 확인되지 않습니다.",kind:"exclusive"},
  {id:"fujifilm-quicksnap-active-800",name:"QuickSnap Active ISO 800",brandId:"fujifilm",cameraIds:["fujifilm-quicksnap-active"],description:"방수 카메라 Active에 탑재된 ISO 800 컬러 네거티브.",kind:"exclusive"},
  {id:"agfaphoto-lebox-color-400",name:"AgfaPhoto LeBox Color 400",brandId:"agfaphoto",cameraIds:["agfa-lebox-flash","agfa-lebox-outdoor","agfa-lebox-ocean"],description:"LeBox 컬러 시리즈의 정확한 원판과 제조사는 공개 정보가 제한적입니다.",kind:"unknown"},
  {id:"manual-disposable-kodak-400",name:"Manual Disposable Kodak 400",brandId:"manual",cameraIds:["manual-disposable"],description:"Kodak 400으로 안내되지만 구체적인 원판은 공개되지 않았습니다. UltraMax 400으로 단정하지 않습니다.",kind:"unknown"},
  {id:"fnd-yunibasaru-built-in",name:"Yunibasaru Built-in Film",brandId:"filmneverdie",cameraIds:["fnd-yunibasaru"],description:"내장 필름의 정확한 제품명과 원판 정보가 확인되지 않습니다.",kind:"unknown"},
  {id:"ilford-hp5-plus",name:"ILFORD HP5 PLUS 400",brandId:"ilford",cameraIds:["ilford-hp5-single-use"],description:"일회용 카메라와 일반 35mm 롤에서 같은 HP5 PLUS를 경험할 수 있습니다.",kind:"available",linkedFilmId:"ilford-hp5-plus-400"},
  {id:"ilford-xp2-super",name:"ILFORD XP2 SUPER 400",brandId:"ilford",cameraIds:["ilford-xp2-single-use"],description:"C-41 현상 흑백 필름. 동일한 일반 롤 제품이 있습니다.",kind:"available",linkedFilmId:"ilford-xp2-super"},
  {id:"agfaphoto-apx-400",name:"AgfaPhoto APX 400",brandId:"agfaphoto",cameraIds:["agfa-lebox-bw"],description:"LeBox 흑백 모델에 탑재된 것으로 안내되는 APX 400은 일반 롤로도 판매됩니다.",kind:"available",linkedFilmId:"agfaphoto-apx-400"},
  {id:"kodak-trix-400",name:"Kodak TRI-X 400",brandId:"kodak",cameraIds:["kodak-400tx-single-use"],description:"400TX 일회용 카메라에 탑재되는 대표적인 흑백 필름.",kind:"available",linkedFilmId:"kodak-trix-400"},
  {id:"reto-prism-400",name:"RETO Retocolor Prism 400",brandId:"reto",cameraIds:["reto-prism-disposable"],description:"카메라 제품군과 별도 35mm 롤로 만나볼 수 있는 특수 컬러 필름.",kind:"available",linkedFilmId:"reto-prism-400"},
];
export const exclusiveById=Object.fromEntries(exclusiveEntries.map(x=>[x.id,x])) as Record<string,ExclusiveEntry>;
