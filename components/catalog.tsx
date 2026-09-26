"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { FilmCard, CameraCard } from "./cards";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { brands, brandById } from "@/data/brands";
import { countries } from "@/data/countries";
import { filmTypeLabel, manufacturingLabel, isoBand, cameraTypeLabel, availabilityLabel, filmAvailabilityFilters, matchesFilmAvailability, catalogStatusLabel, filmAvailabilityLabel, photographyUseLabel, filmCategoryLabel } from "@/lib/format";
import { useStore } from "./store";

type Group={key:string;label:string;options:string[]};
type Filters=Record<string,string[]>;
const filmGroups:Group[]=[
  {key:"brand",label:"Brand",options:brands.map(x=>x.name)},
  {key:"country",label:"Country · 브랜드 국가",options:countries.map(x=>x.name)},
  {key:"manufacturerCountry",label:"Manufacturer Country",options:[...new Set(films.map(x=>x.manufacturerCountry||"미확인"))]},
  {key:"iso",label:"ISO 범위",options:["25 이하","50","80–100","125–200","250–400","500–800","1600 이상"]},
  {key:"type",label:"Film Type",options:Object.values(filmTypeLabel)},
  {key:"process",label:"Process",options:["C-41","B&W","E-6","ECN-2","B&W Reversal","Other"]},
  {key:"photographyUse",label:"Photography Use",options:Object.values(photographyUseLabel)},
  {key:"category",label:"Film Category",options:[...Object.values(filmCategoryLabel),"IR / ORTHO"]},
  {key:"balance",label:"Color Balance",options:["Daylight","Tungsten","미확인"]},
  {key:"sale",label:"Availability · Catalog",options:[...filmAvailabilityFilters]},
  {key:"manufacturing",label:"Manufacturing Type",options:Object.values(manufacturingLabel)},
  {key:"for",label:"Recommended Use",options:["인물","일상","여행","풍경","스트리트","야경","실내","네온","공연","흑백","실험","빈티지","맑은 날","첫 필름","특수 색감","영화 같은 느낌"]},
  {key:"market",label:"Region",options:["Worldwide","USA","Japan","Korea","Europe","Hong Kong","Australia","Canada","China"]},
  {key:"collection",label:"Collection",options:["2025–2026 신제품","새로운 자체 컬러 유제"]},
];
const quickIso:Group={key:"quickIso",label:"ISO",options:["ISO 100","ISO 200","ISO 400","ISO 800+"]};
const cameraGroups:Group[]=[
  {key:"brand",label:"Brand",options:brands.filter(x=>cameras.some(y=>y.brandId===x.id)).map(x=>x.name)},
  {key:"country",label:"Country",options:countries.map(x=>x.name)},
  {key:"type",label:"Camera Type",options:Object.values(cameraTypeLabel)},
  {key:"iso",label:"ISO",options:["25 이하","50","80–100","125–200","250–400","500–800","1600 이상","필름에 따라 다름"]},
  {key:"color",label:"Film",options:["컬러","흑백"]},
  {key:"flash",label:"Flash",options:["있음","없음"]},
  {key:"waterproof",label:"Waterproof",options:["있음","없음"]},
  {key:"process",label:"Process",options:["C-41","B&W","E-6","ECN-2"]},
  {key:"exposures",label:"Exposures",options:["27컷","36컷","필름에 따라 다름","기타"]},
  {key:"reloadable",label:"Reloadable",options:["가능","불가"]},
  {key:"availability",label:"Standalone Film",options:Object.values(availabilityLabel)},
];
const match=(filters:Filters,key:string,value:string)=>!filters[key]?.length||filters[key].includes(value);
const includesAny=(filters:Filters,key:string,values:string[])=>!filters[key]?.length||filters[key].some(x=>values.includes(x));

function FilterGroup({group,selected,toggle}:{group:Group;selected:string[];toggle:(key:string,value:string)=>void}){
  const [expanded,setExpanded]=useState(group.key==="brand"||group.key==="iso");
  useEffect(()=>{if(selected.length)setExpanded(true)},[selected.length]);
  return <div className={`filter-group ${expanded?"expanded":""}`}><button className="filter-group-toggle" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{group.label}<span>{selected.length?`${selected.length}개 선택`:""}<ChevronDown size={15}/></span></button>{expanded&&<div className="filter-options">{group.options.map(value=><button key={value} className={`filter-chip ${selected.includes(value)?"active":""}`} aria-pressed={selected.includes(value)} onClick={()=>toggle(group.key,value)}>{value}</button>)}</div>}</div>;
}

const quickFilters=[
  {label:"COLOR",key:"type",value:"컬러 네거티브"},{label:"B&W",key:"type",value:"흑백 네거티브"},
  ...quickIso.options.map(value=>({label:value,key:"quickIso",value})),
  {label:"C-41",key:"process",value:"C-41"},{label:"E-6",key:"process",value:"E-6"},{label:"ECN-2",key:"process",value:"ECN-2"},
  {label:"STILL",key:"photographyUse",value:"Still Photography"},{label:"MOTION",key:"photographyUse",value:"Motion Picture"},{label:"INDUSTRIAL / SPECIAL",key:"photographyUse",value:"Industrial / Special"},
  {label:"EFFECT",key:"category",value:"Effect"},{label:"PRE-EXPOSED",key:"category",value:"Pre-exposed"},{label:"RED SCALE",key:"category",value:"Red Scale"},{label:"CINEMA",key:"category",value:"Cinema"},{label:"INDUSTRIAL",key:"category",value:"Industrial"},{label:"IR / ORTHO",key:"category",value:"IR / ORTHO"},
  {label:"CURRENT",key:"sale",value:"공식 현행"},
];

export function Catalog({kind}:{kind:"films"|"cameras"}){
  const [filters,setFilters]=useState<Filters>({});
  const [search,setSearch]=useState("");
  const [drawer,setDrawer]=useState(false);
  const [initializedKind,setInitializedKind]=useState<"films"|"cameras"|null>(null);
  const {compare}=useStore();
  const groups=kind==="films"?filmGroups:cameraGroups;
  const urlGroups=useMemo(()=>kind==="films"?[...filmGroups,quickIso]:cameraGroups,[kind]);

  useEffect(()=>{
    const restore=()=>{
      const params=new URLSearchParams(window.location.search);
      const next:Filters={};
      const available=kind==="films"?[...filmGroups,quickIso]:cameraGroups;
      for(const [key,value] of params)if(available.some(group=>group.key===key&&group.options.includes(value)))next[key]=[...(next[key]||[]),value];
      if(kind==="cameras"&&!params.has("type"))next.type=["Single Use"];
      setFilters(next);setSearch(params.get("q")||"");setInitializedKind(kind);
    };
    restore();window.addEventListener("popstate",restore);
    return()=>window.removeEventListener("popstate",restore);
  },[kind]);
  useEffect(()=>{
    if(initializedKind!==kind)return;
    const url=new URL(window.location.href);
    for(const group of urlGroups)url.searchParams.delete(group.key);
    url.searchParams.delete("q");
    for(const group of urlGroups)for(const value of filters[group.key]||[])url.searchParams.append(group.key,value);
    if(search.trim())url.searchParams.set("q",search.trim());
    const next=url.pathname+url.search+url.hash;
    if(next!==window.location.pathname+window.location.search+window.location.hash)window.history.replaceState(window.history.state,"",next);
  },[filters,search,initializedKind,kind,urlGroups]);
  useEffect(()=>{
    if(!drawer)return;
    const previous=document.body.style.overflow;document.body.style.overflow="hidden";
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setDrawer(false)};
    document.addEventListener("keydown",escape);
    return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",escape)};
  },[drawer]);

  const toggle=(key:string,value:string)=>setFilters(prev=>{const current=prev[key]||[];return {...prev,[key]:current.includes(value)?current.filter(x=>x!==value):[...current,value]};});
  const list=useMemo(()=>kind==="films"?films.filter(item=>{
    const brand=brandById[item.brandId];const q=search.trim().toLowerCase();
    const searchable=`${brand.name} ${item.name} ISO ${item.iso} ${item.process} ${item.releaseYear||""} ${item.recommendedFor.join(" ")} ${item.filmType} ${filmTypeLabel[item.filmType]} ${item.manufacturer||""} ${item.stockOrigin||""} ${item.sourceStockCode||""} ${item.searchAliases?.join(" ")||""} ${catalogStatusLabel[item.catalogStatus]} ${filmAvailabilityLabel[item.availabilityStatus]} ${item.marketRegions?.join(" ")||""} ${item.filmType==="black-and-white"?"black and white 흑백":""} ${item.night>=4?"night 야경":""}`.toLowerCase();
    const exactIso=!filters.quickIso?.length||filters.quickIso.some(value=>value==="ISO 800+"?item.iso>=800:item.iso===Number(value.replace("ISO ","")));
    const categoryValues=[filmCategoryLabel[item.filmCategory||"standard"],...(item.filmCategory==="infrared"||item.filmCategory==="ortho"?["IR / ORTHO"]:[])];
    return (!q||searchable.includes(q))&&match(filters,"brand",brand.name)&&match(filters,"country",brand.country)&&match(filters,"manufacturerCountry",item.manufacturerCountry||"미확인")&&match(filters,"type",filmTypeLabel[item.filmType])&&match(filters,"iso",isoBand(item.iso))&&exactIso&&match(filters,"process",item.process)&&match(filters,"photographyUse",photographyUseLabel[item.photographyUse||"still"])&&includesAny(filters,"category",categoryValues)&&match(filters,"balance",item.balance==="daylight"?"Daylight":item.balance==="tungsten"?"Tungsten":"미확인")&&match(filters,"manufacturing",manufacturingLabel[item.manufacturingType])&&(!filters.sale?.length||filters.sale.some(value=>matchesFilmAvailability(item,value)))&&(!filters.market?.length||filters.market.some(value=>item.marketRegions?.includes(value as typeof item.marketRegions[number])))&&includesAny(filters,"for",item.recommendedFor)&&includesAny(filters,"collection",item.collectionTags||[]);
  }):cameras.filter(item=>{
    const brand=brandById[item.brandId];const q=search.trim().toLowerCase();
    return (!q||`${brand.name} ${item.name} ISO ${item.iso} ${item.embeddedFilmName}`.toLowerCase().includes(q))&&match(filters,"brand",brand.name)&&match(filters,"country",item.country)&&match(filters,"type",cameraTypeLabel[item.cameraType])&&match(filters,"iso",isoBand(item.iso))&&match(filters,"color",item.filmType==="black-and-white"?"흑백":"컬러")&&match(filters,"flash",item.flash?"있음":"없음")&&match(filters,"waterproof",item.waterproof?"있음":"없음")&&match(filters,"process",item.process)&&match(filters,"exposures",item.exposures===0?"필름에 따라 다름":item.exposures===27?"27컷":item.exposures===36?"36컷":"기타")&&match(filters,"reloadable",item.reloadable?"가능":"불가")&&match(filters,"availability",availabilityLabel[item.standaloneFilmAvailability]);
  }),[kind,filters,search]);
  const active=Object.values(filters).reduce((n,a)=>n+a.length,0);
  const setSingle=(key:string,value:string)=>setFilters(prev=>({...prev,[key]:[value]}));

  return <div className="cabinet-catalog">
    {kind==="films"&&<div className="browse-rows"><div><span>Browse by Brand</span><div className="browse-chips">{brands.map(brand=><button key={brand.id} type="button" className={filters.brand?.includes(brand.name)?"active":""} onClick={()=>setSingle("brand",brand.name)}>{brand.name}</button>)}<Link href="/brands">모든 브랜드 ↗</Link></div></div><div><span>Browse by Country</span><div className="browse-chips">{countries.filter(x=>x.name!=="기타 / 불명").map(country=><button key={country.name} type="button" className={filters.country?.includes(country.name)?"active":""} onClick={()=>setSingle("country",country.name)}>{country.flag} {country.name}</button>)}<Link href="/countries">국가별 보기 ↗</Link></div></div></div>}
    {kind==="cameras"&&<div className="camera-type-tabs" role="tablist" aria-label="카메라 종류">{[["SINGLE USE","Single Use"],["PRELOADED","Preloaded Reusable"],["REUSABLE","Reusable"]].map(([label,value])=><button role="tab" aria-selected={filters.type?.length===1&&filters.type[0]===value} key={value} className={filters.type?.length===1&&filters.type[0]===value?"active":""} onClick={()=>setSingle("type",value)}>{label}</button>)}<button className="all-camera-tab" onClick={()=>setFilters(prev=>({...prev,type:[]}))} aria-label="모든 카메라 보기">전체 보기</button></div>}
    <div className="catalog-main-tools"><div className="catalog-search"><Search size={18}/><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder={kind==="films"?"Search films...":"Search cameras..."} aria-label={kind==="films"?"필름 검색":"카메라 검색"}/></div><button className="advanced-trigger" type="button" onClick={()=>setDrawer(true)} aria-expanded={drawer}><SlidersHorizontal size={17}/> Filters {active>0&&<b>{active}</b>}</button><strong className="result-count">{list.length} {kind}</strong></div>
    {kind==="films"&&<div className="quick-filters" aria-label="빠른 필터">{quickFilters.map(x=><button type="button" key={x.label} className={filters[x.key]?.includes(x.value)?"active":""} aria-pressed={!!filters[x.key]?.includes(x.value)} onClick={()=>toggle(x.key,x.value)}>{x.label}</button>)}</div>}
    {active>0&&<div className="active-filters" aria-label="적용된 필터">{Object.entries(filters).flatMap(([key,values])=>values.map(value=><button key={`${key}-${value}`} onClick={()=>toggle(key,value)} title={`${value} 필터 해제`}>{value}<X size={13}/></button>))}<button className="clear-all" onClick={()=>setFilters({})}>Clear all</button></div>}
    {list.length?<div className="card-grid">{kind==="films"?list.map(item=><FilmCard key={item.id} film={item as typeof films[number]}/>):list.map(item=><CameraCard key={item.id} camera={item as typeof cameras[number]}/>)}</div>:<div className="empty-state"><h3>이 조건에 맞는 {kind==="films"?"필름":"카메라"}이 캐비닛에 없습니다.</h3><p>필터를 줄이거나 다른 검색어로 찾아보세요.</p><button onClick={()=>{setFilters({});setSearch("");}}>필터 초기화</button></div>}
    {drawer&&<><button className="filter-backdrop" aria-label="필터 닫기" onClick={()=>setDrawer(false)}/><aside className="filter-panel open" role="dialog" aria-modal="true" aria-label="고급 필터"><div className="filter-panel-head"><h3>Advanced Filters <span>{active}개 선택</span></h3><button className="filter-close" aria-label="필터 닫기" onClick={()=>setDrawer(false)}><X size={20}/></button></div><div className="filter-scroll">{groups.map(group=><FilterGroup key={group.key} group={group} selected={filters[group.key]||[]} toggle={toggle}/>)}</div><div className="filter-panel-foot"><button className="filter-reset" onClick={()=>{setFilters({});setSearch("");}}>Clear all</button><button className="filter-show" onClick={()=>setDrawer(false)}>{list.length}개 결과 보기</button></div></aside></>}
    {compare[kind].length>0&&<div className="compare-tray"><span>{kind==="films"?"필름":"카메라"} {compare[kind].length}/4개 선택</span><Link href="/compare">선택 항목 비교하기 →</Link></div>}
  </div>;
}
