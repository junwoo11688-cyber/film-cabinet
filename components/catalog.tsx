"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilmCard, CameraCard } from "./cards";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { brands, brandById } from "@/data/brands";
import { countries } from "@/data/countries";
import { filmTypeLabel, manufacturingLabel, isoBand, cameraTypeLabel, availabilityLabel } from "@/lib/format";

type Group={key:string;label:string;options:string[]};
type Filters=Record<string,string[]>;
const filmGroups:Group[]=[
  {key:"brand",label:"브랜드",options:brands.map(x=>x.name)},
  {key:"country",label:"브랜드 국가",options:countries.map(x=>x.name)},
  {key:"type",label:"필름 종류",options:Object.values(filmTypeLabel)},
  {key:"iso",label:"ISO",options:["25 이하","50","80–100","125–200","250–400","500–800","1600 이상"]},
  {key:"process",label:"현상 방식",options:["C-41","B&W","E-6","ECN-2"]},
  {key:"manufacturing",label:"브랜드 형태",options:Object.values(manufacturingLabel)},
  {key:"for",label:"추천 촬영",options:["인물","일상","여행","풍경","스트리트","야경","실내","네온","공연","흑백","실험","빈티지","맑은 날","첫 필름","특수 색감","영화 같은 느낌"]},
];
const cameraGroups:Group[]=[
  {key:"brand",label:"브랜드",options:brands.filter(x=>cameras.some(y=>y.brandId===x.id)).map(x=>x.name)},
  {key:"country",label:"국가",options:countries.map(x=>x.name)},
  {key:"type",label:"카메라 종류",options:Object.values(cameraTypeLabel)},
  {key:"iso",label:"ISO",options:["25 이하","50","80–100","125–200","250–400","500–800","1600 이상","필름에 따라 다름"]},
  {key:"color",label:"필름",options:["컬러","흑백"]},
  {key:"flash",label:"플래시",options:["있음","없음"]},
  {key:"waterproof",label:"방수",options:["있음","없음"]},
  {key:"process",label:"현상 방식",options:["C-41","B&W","E-6","ECN-2"]},
  {key:"exposures",label:"컷 수",options:["27컷","36컷","필름에 따라 다름","기타"]},
  {key:"reloadable",label:"재장전",options:["가능","불가"]},
  {key:"availability",label:"내장 필름 별도 구매",options:Object.values(availabilityLabel)},
];
const match=(filters:Filters,key:string,value:string)=>!filters[key]?.length||filters[key].includes(value);
const includesAny=(filters:Filters,key:string,values:string[])=>!filters[key]?.length||filters[key].some(x=>values.includes(x));

export function Catalog({kind}:{kind:"films"|"cameras"}){
  const [filters,setFilters]=useState<Filters>({});const [search,setSearch]=useState("");const [drawer,setDrawer]=useState(false);
  useEffect(()=>{const url=new URL(window.location.href);const next:Filters={};for(const [key,value] of url.searchParams){if((kind==="films"?filmGroups:cameraGroups).some(x=>x.key===key))next[key]=[...(next[key]||[]),value];}setFilters(next);},[kind]);
  const groups=kind==="films"?filmGroups:cameraGroups;
  const toggle=(key:string,value:string)=>setFilters(prev=>{const current=prev[key]||[];return {...prev,[key]:current.includes(value)?current.filter(x=>x!==value):[...current,value]};});
  const list=useMemo(()=>kind==="films"?films.filter(item=>{
    const brand=brandById[item.brandId];const q=search.trim().toLowerCase();
    return (!q||`${brand.name} ${item.name} ISO ${item.iso} ${item.process} ${item.recommendedFor.join(" ")}`.toLowerCase().includes(q))&&match(filters,"brand",brand.name)&&match(filters,"country",brand.country)&&match(filters,"type",filmTypeLabel[item.filmType])&&match(filters,"iso",isoBand(item.iso))&&match(filters,"process",item.process)&&match(filters,"manufacturing",manufacturingLabel[item.manufacturingType])&&includesAny(filters,"for",item.recommendedFor);
  }):cameras.filter(item=>{
    const brand=brandById[item.brandId];const q=search.trim().toLowerCase();
    return (!q||`${brand.name} ${item.name} ISO ${item.iso} ${item.embeddedFilmName}`.toLowerCase().includes(q))&&match(filters,"brand",brand.name)&&match(filters,"country",item.country)&&match(filters,"type",cameraTypeLabel[item.cameraType])&&match(filters,"iso",isoBand(item.iso))&&match(filters,"color",item.filmType==="black-and-white"?"흑백":"컬러")&&match(filters,"flash",item.flash?"있음":"없음")&&match(filters,"waterproof",item.waterproof?"있음":"없음")&&match(filters,"process",item.process)&&match(filters,"exposures",item.exposures===0?"필름에 따라 다름":item.exposures===27?"27컷":item.exposures===36?"36컷":"기타")&&match(filters,"reloadable",item.reloadable?"가능":"불가")&&match(filters,"availability",availabilityLabel[item.standaloneFilmAvailability]);
  }),[kind,filters,search]);
  const active=Object.values(filters).reduce((n,a)=>n+a.length,0);
  return <div className="catalog-layout"><aside className={`filter-panel ${drawer?"open":""}`}><h3>필터 <span>{active}개 선택</span></h3>{groups.map(group=><div className="filter-group" key={group.key}><h4>{group.label}</h4><div className="filter-options">{group.options.map(value=><button key={value} className={`filter-chip ${filters[group.key]?.includes(value)?"active":""}`} aria-pressed={!!filters[group.key]?.includes(value)} onClick={()=>toggle(group.key,value)}>{value}</button>)}</div></div>)}<button className="filter-reset" onClick={()=>{setFilters({});setSearch("");}}>필터 초기화</button></aside>
    <div><div className="catalog-toolbar"><strong>전체 {list.length}개 결과</strong><input className="toolbar-input" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={kind==="films"?"목록에서 필름 검색":"목록에서 카메라 검색"} aria-label={kind==="films"?"필름 검색":"카메라 검색"}/><button className="filter-toggle" onClick={()=>setDrawer(!drawer)}>{drawer?<X size={16}/>:<SlidersHorizontal size={16}/>} 필터 {active?`(${active})`:""}</button></div>
      {list.length?<div className="card-grid">{kind==="films"?list.map(item=><FilmCard key={item.id} film={item as typeof films[number]}/>):list.map(item=><CameraCard key={item.id} camera={item as typeof cameras[number]}/>)}</div>:<div className="empty-state"><h3>조건에 맞는 항목이 없습니다.</h3><p>필터를 줄이거나 다른 검색어를 입력해보세요.</p><button onClick={()=>{setFilters({});setSearch("");}}>필터 초기화</button></div>}</div>
  </div>;
}
