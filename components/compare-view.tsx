"use client";

import Link from "next/link";
import { useState } from "react";
import { films, filmById } from "@/data/films";
import { cameras, cameraById } from "@/data/cameras";
import { brandById } from "@/data/brands";
import { filmTypeLabel, manufacturingLabel, stockLabel, availabilityLabel, cameraExposures, catalogStatusLabel, filmAvailabilityLabel } from "@/lib/format";
import { useStore } from "./store";

type Kind="films"|"cameras";
const scoreValue=(id:string,key:"grain"|"contrast"|"saturation"|"latitude"|"portrait"|"landscape"|"night"|"beginner"|"uniqueness")=>filmById[id].profileEstimated?"미평가":`${filmById[id][key]}/5`;
const filmRows:[string,(id:string)=>React.ReactNode][]=[
  ["ISO",id=>filmById[id].iso],["종류",id=>filmTypeLabel[filmById[id].filmType]],["현상",id=>filmById[id].process],["색온도",id=>filmById[id].balance||"미확인"],["브랜드 국가",id=>filmById[id].brandCountry],["실제 제조사",id=>filmById[id].manufacturer||"공개되지 않음"],["제조 국가",id=>filmById[id].manufacturerCountry||"미확인"],["원판",id=>filmById[id].stockOrigin||"공개되지 않음"],["제조 방식",id=>manufacturingLabel[filmById[id].manufacturingType]],["입자 고움",id=>scoreValue(id,"grain")],["콘트라스트",id=>scoreValue(id,"contrast")],["채도",id=>scoreValue(id,"saturation")],["노출 관용도",id=>scoreValue(id,"latitude")],["인물",id=>scoreValue(id,"portrait")],["풍경",id=>scoreValue(id,"landscape")],["야간",id=>scoreValue(id,"night")],["입문 난이도",id=>scoreValue(id,"beginner")],["개성",id=>scoreValue(id,"uniqueness")],["카탈로그",id=>catalogStatusLabel[filmById[id].catalogStatus]],["구매 상태",id=>filmAvailabilityLabel[filmById[id].availabilityStatus]],["판매 지역",id=>filmById[id].marketRegions?.join(" · ")||"미확인"],["마지막 확인",id=>filmById[id].availabilityCheckedAt||"미확인"],["신뢰도",id=>filmById[id].dataConfidence.toUpperCase()],
];
const cameraRows:[string,(id:string)=>React.ReactNode][]=[
  ["ISO",id=>cameraById[id].iso||"필름에 따라 다름"],["컷 수",id=>cameraExposures(cameraById[id].exposures)],["내장 필름",id=>cameraById[id].embeddedFilmName||"별도 장전"],["종류",id=>filmTypeLabel[cameraById[id].filmType]],["현상",id=>cameraById[id].process],["플래시",id=>cameraById[id].flash?"있음":"없음"],["방수",id=>cameraById[id].waterproof?cameraById[id].waterproofDepth?`${cameraById[id].waterproofDepth}m`:"있음":"없음"],["렌즈",id=>cameraById[id].lens||"공개 정보 없음"],["재장전",id=>cameraById[id].reloadable?"가능":"불가"],["필름 별도 구매",id=>availabilityLabel[cameraById[id].standaloneFilmAvailability]],["Stock 상태",id=>stockLabel[cameraById[id].stockStatus]],
];
export function CompareView(){
  const [kind,setKind]=useState<Kind>("films");const {compare,toggleCompare,clearCompare}=useStore();const items=kind==="films"?films:cameras;const ids=compare[kind];const rows=kind==="films"?filmRows:cameraRows;
  return <><div className="tabs"><button className={kind==="films"?"active":""} onClick={()=>setKind("films")}>Films ({compare.films.length})</button><button className={kind==="cameras"?"active":""} onClick={()=>setKind("cameras")}>Cameras ({compare.cameras.length})</button></div>
    <div className="compare-picker"><h3>{kind==="films"?"비교할 필름":"비교할 카메라"} 선택 · 최대 4개</h3><select value="" disabled={ids.length>=4} onChange={e=>e.target.value&&toggleCompare(kind,e.target.value)} aria-label="비교 항목 추가"><option value="">{ids.length>=4?"최대 4개 선택됨":"항목 추가하기"}</option>{items.filter(x=>!ids.includes(x.id)).map(x=><option key={x.id} value={x.id}>{brandById[x.brandId].name} {x.name}</option>)}</select><div className="selected-items">{ids.map(id=><button key={id} onClick={()=>toggleCompare(kind,id)}>{brandById[(kind==="films"?filmById[id]:cameraById[id]).brandId].name} {(kind==="films"?filmById[id]:cameraById[id]).name} ×</button>)}{ids.length>0&&<button onClick={()=>clearCompare(kind)}>모두 지우기</button>}</div></div>
    {ids.length?<div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>비교 항목</th>{ids.map(id=><th key={id}><Link href={kind==="films"?`/film/${id}`:`/camera/${id}`}>{brandById[(kind==="films"?filmById[id]:cameraById[id]).brandId].name}<br/>{(kind==="films"?filmById[id]:cameraById[id]).name} ↗</Link></th>)}</tr></thead><tbody>{rows.map(([label,get])=><tr key={label}><td>{label}</td>{ids.map(id=><td key={id}>{get(id)}</td>)}</tr>)}</tbody></table></div>:<div className="empty-state"><h3>아직 비교할 항목이 없습니다.</h3><p>필름이나 카메라 카드의 + 버튼으로 최대 4개를 담아보세요.</p><Link href={kind==="films"?"/films":"/cameras"}>목록 둘러보기</Link></div>}
    <div className="guide-note">점수는 필름 품질 순위가 아니라 촬영 특성과 적합도입니다. 카메라의 사진 결과는 내장 필름뿐 아니라 렌즈와 셔터, 조리개, 플래시의 영향도 받습니다.</div>
  </>;
}
