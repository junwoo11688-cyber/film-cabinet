"use client";

import Link from "next/link";
import { useState } from "react";
import { films, filmById } from "@/data/films";
import { cameras, cameraById } from "@/data/cameras";
import { brandById } from "@/data/brands";
import { filmTypeLabel, manufacturingLabel, stockLabel, availabilityLabel, cameraExposures, catalogStatusLabel, filmAvailabilityLabel } from "@/lib/format";
import { useStore } from "./store";

type Kind="films"|"cameras";
type Row=[string,(id:string)=>React.ReactNode];
type Section={title:string;rows:Row[]};
const score=(id:string,key:"grain"|"contrast"|"saturation"|"latitude"|"portrait"|"landscape"|"night"|"beginner"|"uniqueness")=>filmById[id].profileEstimated?"미평가":`${filmById[id][key]}/5`;
const filmSections:Section[]=[
  {title:"BASIC",rows:[["ISO",id=>filmById[id].iso],["Film Type",id=>filmTypeLabel[filmById[id].filmType]],["Process",id=>filmById[id].process],["Balance",id=>filmById[id].balance||"미확인"]]},
  {title:"LOOK",rows:[["Grain",id=>score(id,"grain")],["Contrast",id=>score(id,"contrast")],["Saturation",id=>score(id,"saturation")],["Latitude",id=>score(id,"latitude")],["Uniqueness",id=>score(id,"uniqueness")]]},
  {title:"USE",rows:[["Portrait",id=>score(id,"portrait")],["Landscape",id=>score(id,"landscape")],["Night",id=>score(id,"night")],["Beginner",id=>score(id,"beginner")]]},
  {title:"ORIGIN",rows:[["Brand",id=>brandById[filmById[id].brandId].name],["Brand Country",id=>filmById[id].brandCountry],["Manufacturer",id=>filmById[id].manufacturer||"공개되지 않음"],["Manufacturer Country",id=>filmById[id].manufacturerCountry||"미확인"],["Original Stock",id=>filmById[id].stockOrigin||"공개되지 않음"],["Manufacturing",id=>manufacturingLabel[filmById[id].manufacturingType]],["Confidence",id=>filmById[id].dataConfidence.toUpperCase()]]},
  {title:"STATUS",rows:[["Catalog",id=>catalogStatusLabel[filmById[id].catalogStatus]],["Availability",id=>filmAvailabilityLabel[filmById[id].availabilityStatus]],["Region",id=>filmById[id].marketRegions?.join(" · ")||"미확인"],["Last Verified",id=>filmById[id].availabilityCheckedAt||"미확인"]]},
];
const cameraSections:Section[]=[
  {title:"BASIC",rows:[["ISO",id=>cameraById[id].iso||"미확인"],["Exposures",id=>cameraExposures(cameraById[id].exposures)],["Camera Type",id=>cameraById[id].cameraType],["Film Type",id=>filmTypeLabel[cameraById[id].filmType]],["Process",id=>cameraById[id].process]]},
  {title:"FILM INSIDE",rows:[["Embedded Film",id=>cameraById[id].embeddedFilmName||"별도 장전"],["Standalone Roll",id=>availabilityLabel[cameraById[id].standaloneFilmAvailability]],["Stock Status",id=>stockLabel[cameraById[id].stockStatus]],["Exact Match",id=>cameraById[id].exactFilmMatch?"확인됨":"미확인"]]},
  {title:"CAMERA",rows:[["Flash",id=>cameraById[id].flash?"있음":"없음"],["Waterproof",id=>cameraById[id].waterproof?cameraById[id].waterproofDepth?`${cameraById[id].waterproofDepth}m`:"있음":"없음"],["Lens",id=>cameraById[id].lens||"공개 정보 없음"],["Reloadable",id=>cameraById[id].reloadable?"가능":"불가"]]},
];
export function CompareView(){
  const [kind,setKind]=useState<Kind>("films");
  const {compare,toggleCompare,clearCompare}=useStore();
  const items=kind==="films"?films:cameras;
  const ids=compare[kind];
  const sections=kind==="films"?filmSections:cameraSections;
  return <><div className="tabs" role="tablist" aria-label="비교 대상"><button role="tab" aria-selected={kind==="films"} className={kind==="films"?"active":""} onClick={()=>setKind("films")}>Films ({compare.films.length})</button><button role="tab" aria-selected={kind==="cameras"} className={kind==="cameras"?"active":""} onClick={()=>setKind("cameras")}>Cameras ({compare.cameras.length})</button></div>
    <div className="compare-picker"><h2>{kind==="films"?"비교할 필름":"비교할 카메라"} 선택 <small>최대 4개</small></h2><select value="" disabled={ids.length>=4} onChange={event=>event.target.value&&toggleCompare(kind,event.target.value)} aria-label="비교 항목 추가"><option value="">{ids.length>=4?"최대 4개 선택됨":"항목 추가하기"}</option>{items.filter(x=>!ids.includes(x.id)).map(x=><option key={x.id} value={x.id}>{brandById[x.brandId].name} {x.name}</option>)}</select><div className="selected-items">{ids.map(id=><button key={id} onClick={()=>toggleCompare(kind,id)} aria-label={`${(kind==="films"?filmById[id]:cameraById[id]).name} 비교에서 제거`}>{brandById[(kind==="films"?filmById[id]:cameraById[id]).brandId].name} {(kind==="films"?filmById[id]:cameraById[id]).name} ×</button>)}{ids.length>0&&<button onClick={()=>clearCompare(kind)}>모두 지우기</button>}</div></div>
    {ids.length?<div className="compare-table-wrap" tabIndex={0} aria-label="비교 표, 가로로 스크롤 가능"><table className="compare-table"><thead><tr><th scope="col">비교 항목</th>{ids.map(id=><th scope="col" key={id}><Link href={kind==="films"?`/film/${id}`:`/camera/${id}`}><small>{brandById[(kind==="films"?filmById[id]:cameraById[id]).brandId].name}</small><strong>{(kind==="films"?filmById[id]:cameraById[id]).name}</strong><span>상세보기 ↗</span></Link></th>)}</tr></thead>{sections.map(section=><tbody key={section.title}><tr className="compare-section"><th scope="rowgroup" colSpan={ids.length+1}>{section.title}</th></tr>{section.rows.map(([label,get])=><tr key={label}><th scope="row">{label}</th>{ids.map(id=><td key={id}>{get(id)}</td>)}</tr>)}</tbody>)}</table></div>:<div className="empty-state"><h3>아직 비교할 항목이 없습니다.</h3><p>필름이나 카메라 카드의 비교 버튼으로 최대 4개를 담아보세요.</p><Link href={kind==="films"?"/films":"/cameras"}>목록 둘러보기</Link></div>}
    <div className="guide-note">점수는 품질 순위가 아닌 촬영 특성과 적합도입니다. 카메라의 결과는 필름뿐 아니라 렌즈와 셔터, 조리개, 플래시의 영향도 받습니다.</div>
  </>;
}
