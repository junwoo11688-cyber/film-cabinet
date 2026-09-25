"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { FilmCard, CameraCard } from "./cards";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { brands, brandById } from "@/data/brands";
import { countries } from "@/data/countries";
import { filmTypeLabel, manufacturingLabel, isoBand, cameraTypeLabel, availabilityLabel } from "@/lib/format";
import { useStore } from "./store";

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
function FilterGroup({group,selected,toggle}:{group:Group;selected:string[];toggle:(key:string,value:string)=>void}){
  const [expanded,setExpanded]=useState(group.key==="brand"||group.key==="iso");
  useEffect(()=>{if(selected.length)setExpanded(true)},[selected.length]);
  return <div className={`filter-group ${expanded?"expanded":""}`}><button className="filter-group-toggle" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{group.label}<span>{selected.length?`${selected.length}개 선택`:""}<ChevronDown size={15}/></span></button>{expanded&&<div className="filter-options">{group.options.map(value=><button key={value} className={`filter-chip ${selected.includes(value)?"active":""}`} aria-pressed={selected.includes(value)} onClick={()=>toggle(group.key,value)}>{value}</button>)}</div>}</div>;
}

export function Catalog({kind}:{kind:"films"|"cameras"}){
  const [filters,setFilters]=useState<Filters>({});const [search,setSearch]=useState("");const [drawer,setDrawer]=useState(false);
  const [initializedKind,setInitializedKind]=useState<"films"|"cameras"|null>(null);
  const {compare}=useStore();const compareCount=compare[kind].length;
  useEffect(()=>{
    const restoreFromUrl=()=>{
      const params=new URLSearchParams(window.location.search);
      const next:Filters={};
      const availableGroups=kind==="films"?filmGroups:cameraGroups;
      for(const [key,value] of params){
        if(availableGroups.some(group=>group.key===key&&group.options.includes(value)))next[key]=[...(next[key]||[]),value];
      }
      setFilters(next);
      setSearch(params.get("q")||"");
      setInitializedKind(kind);
    };
    restoreFromUrl();
    window.addEventListener("popstate",restoreFromUrl);
    return()=>window.removeEventListener("popstate",restoreFromUrl);
  },[kind]);
  useEffect(()=>{
    if(initializedKind!==kind)return;
    const url=new URL(window.location.href);
    const availableGroups=kind==="films"?filmGroups:cameraGroups;
    for(const group of availableGroups)url.searchParams.delete(group.key);
    url.searchParams.delete("q");
    for(const group of availableGroups)for(const value of filters[group.key]||[])url.searchParams.append(group.key,value);
    if(search.trim())url.searchParams.set("q",search.trim());
    const nextUrl=url.pathname+url.search+url.hash;
    if(nextUrl!==window.location.pathname+window.location.search+window.location.hash){
      window.history.replaceState(window.history.state,"",nextUrl);
    }
  },[kind,filters,search,initializedKind]);
  useEffect(()=>{if(!drawer)return;const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setDrawer(false)};document.addEventListener("keydown",onKey);document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=""}},[drawer]);
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
  return <div className="catalog-layout">
    {drawer&&<button className="filter-backdrop" aria-label="필터 닫기" onClick={()=>setDrawer(false)}/>}
    <aside className={`filter-panel ${drawer?"open":""}`} aria-label="목록 필터"><div className="filter-panel-head"><h3>필터 <span>{active}개 선택</span></h3><button className="filter-close" aria-label="필터 닫기" onClick={()=>setDrawer(false)}><X size={20}/></button></div><div className="filter-scroll">{groups.map(group=><FilterGroup key={group.key} group={group} selected={filters[group.key]||[]} toggle={toggle}/>)}</div><div className="filter-panel-foot"><button className="filter-reset" onClick={()=>{setFilters({});setSearch("");}}>초기화</button><button className="filter-show" onClick={()=>setDrawer(false)}>{list.length}개 결과 보기</button></div></aside>
    <div className="catalog-results">{kind==="cameras"&&<div className="camera-type-tabs" aria-label="카메라 종류 선택">{[["전체",""],["일회용","Single Use"],["재장전 가능","Preloaded Reusable"],["일반 재사용","Reusable"]].map(([label,value])=><button key={label} className={value?(filters.type?.length===1&&filters.type[0]===value?"active":""):!filters.type?.length?"active":""} onClick={()=>setFilters(prev=>({...prev,type:value?[value]:[]}))}>{label}</button>)}</div>}<div className="catalog-toolbar"><strong>전체 {list.length}개 결과</strong><input className="toolbar-input" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={kind==="films"?"목록에서 필름 검색":"목록에서 카메라 검색"} aria-label={kind==="films"?"필름 검색":"카메라 검색"}/><button className="filter-toggle" onClick={()=>setDrawer(true)} aria-expanded={drawer}><SlidersHorizontal size={16}/>{active?`필터 ${active}개 적용`:"필터"}</button></div>
      {active>0&&<div className="active-filters" aria-label="적용된 필터">{Object.entries(filters).flatMap(([key,values])=>values.map(value=><button key={`${key}-${value}`} onClick={()=>toggle(key,value)} title={`${value} 필터 해제`}>{value}<X size={13}/></button>))}<button className="clear-all" onClick={()=>setFilters({})}>모두 지우기</button></div>}
      {list.length?<div className="card-grid">{kind==="films"?list.map(item=><FilmCard key={item.id} film={item as typeof films[number]}/>):list.map(item=><CameraCard key={item.id} camera={item as typeof cameras[number]}/>)}</div>:<div className="empty-state"><h3>조건에 맞는 항목이 없습니다.</h3><p>필터를 줄이거나 다른 검색어를 입력해보세요.</p><button onClick={()=>{setFilters({});setSearch("");}}>필터 초기화</button></div>}</div>
    {compareCount>0&&<div className="compare-tray"><span>{kind==="films"?"필름":"카메라"} {compareCount}/4개 선택</span><Link href="/compare">선택 항목 비교하기 →</Link></div>}
  </div>;
}
