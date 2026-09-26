"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, Check, ArrowUpRight, Flashlight, Droplets, GitCompareArrows, Eye, X } from "lucide-react";
import { Film, Camera, Confidence } from "@/data/types";
import { brandById } from "@/data/brands";
import { countryFlag } from "@/data/countries";
import { confidenceLabel, filmTypeShort, filmTypeLabel, stockLabel, cameraTypeLabel, cameraExposures, catalogStatusLabel, filmAvailabilityLabel, practicalGrainLabel, practicalContrastLabel, practicalSaturationLabel, recommendedUseLabel, dxCodingLabel, colorBalanceLabel } from "@/lib/format";
import { useStore } from "./store";

export function ConfidenceBadge({confidence}:{confidence:Confidence}){return <span className={`confidence ${confidence}`}>{confidenceLabel[confidence]}</span>}
export function FilmStatusBadges({film:item}:{film:Film}){return <div className="film-status-row"><span className={`film-status catalog-${item.catalogStatus}`}>{catalogStatusLabel[item.catalogStatus]}</span><span className={`film-status availability-${item.availabilityStatus}`}>{filmAvailabilityLabel[item.availabilityStatus]}{(item.availabilityStatus==="regional"||item.availabilityStatus==="preorder")&&item.marketRegions?.length?` · ${item.marketRegions.join(", ").toUpperCase()}`:""}</span></div>}

export function FilmArt({film:item,large=false}:{film:Film;large?:boolean}){
  const brand=brandById[item.brandId];
  const artColor=item.colorProfile[0]||brand.color;
  return <div className={`film-art ${large?"large":""}`} style={{"--art-color":artColor,"--brand-accent":brand.color} as React.CSSProperties} aria-hidden="true">
    <div className="film-art-top"><span>{brand.name.toUpperCase()}</span><span>{item.packagingType==="35mm-motion-bulk"?"35MM / MOTION":item.packagingType==="35mm-bulk"?"35MM / BULK":item.packagingType==="other"?"35MM / OTHER":"35MM / 135"}</span></div>
    <div className="film-art-center"><span className="film-art-name">{item.name}</span><span className="film-art-iso">ISO<br/><b>{item.iso}</b></span></div>
    <div className="film-art-palette">{item.colorProfile.slice(0,4).map((color,index)=><span key={`${color}-${index}`} style={{background:color}}/>)}</div>
    <div className="film-art-bottom"><span>{filmTypeShort[item.filmType]}</span><span>● ● ● ● ●</span><span>{item.process}</span></div>
  </div>;
}

export function CameraArt({camera:item,large=false}:{camera:Camera;large?:boolean}){
  const brand=brandById[item.brandId];
  return <div className={`camera-art ${large?"large":""}`} style={{"--art-color":brand.color} as React.CSSProperties} aria-hidden="true">
    <div className="camera-art-head"><span>{brand.name.toUpperCase()}</span><span>35MM</span></div>
    <div className="camera-illustration"><span className="camera-flash"/><span className="camera-lens"><i/></span><span className="camera-viewfinder"/></div>
    <div className="camera-art-bottom"><span>{item.name}</span><b>{item.iso?`ISO ${item.iso}`:"ISO —"}</b></div>
  </div>;
}

function FilmQuickView({film:item,onClose}:{film:Film;onClose:()=>void}){
  const brand=brandById[item.brandId];
  const dialog=useRef<HTMLElement>(null);
  const previousFocus=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    previousFocus.current=document.activeElement as HTMLElement|null;
    const previousOverflow=document.body.style.overflow;document.body.style.overflow="hidden";
    const focusable=()=>Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')||[]);
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==="Escape")onClose();
      if(event.key==="Tab"){
        const items=focusable();if(!items.length)return;
        const first=items[0],last=items[items.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener("keydown",onKey);window.setTimeout(()=>focusable()[0]?.focus(),0);
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener("keydown",onKey);previousFocus.current?.focus();};
  },[onClose]);
  const profile=item.practicalProfile;
  return createPortal(<div className="quick-view-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><section ref={dialog} className="quick-view-sheet" role="dialog" aria-modal="true" aria-labelledby={`quick-view-${item.id}`}><div className="quick-view-head"><span>QUICK VIEW</span><button type="button" onClick={onClose} aria-label="Quick View 닫기"><X size={20}/></button></div><div className="quick-view-brand">{countryFlag(brand.country)} {brand.name}</div><h2 id={`quick-view-${item.id}`}>{item.name}</h2><div className="quick-view-essentials"><strong>ISO {item.iso}</strong><span>{filmTypeLabel[item.filmType]}</span><span>{item.process}</span></div><dl className="quick-view-specs">{profile?.grain&&profile.grain!=="unknown"&&<div><dt>GRAIN</dt><dd>{practicalGrainLabel[profile.grain]}</dd></div>}{profile?.contrast&&profile.contrast!=="unknown"&&<div><dt>CONTRAST</dt><dd>{practicalContrastLabel[profile.contrast]}</dd></div>}{profile?.saturation&&profile.saturation!=="unknown"&&profile.saturation!=="not-applicable"&&<div><dt>SATURATION</dt><dd>{practicalSaturationLabel[profile.saturation]}</dd></div>}{item.dxCoding&&item.packagingType==="135-cartridge"&&<div><dt>DX</dt><dd>{dxCodingLabel[item.dxCoding]}</dd></div>}{item.colorBalance&&item.colorBalance!=="unknown"&&item.colorBalance!=="not-applicable"&&<div><dt>BALANCE</dt><dd>{colorBalanceLabel[item.colorBalance]}</dd></div>}</dl>{profile?.recommendedUses?.length&&<div className="quick-view-tags"><span>BEST FOR</span><div>{profile.recommendedUses.slice(0,3).map(value=><b key={value}>{recommendedUseLabel[value]}</b>)}</div></div>}<div className="quick-view-availability"><span>AVAILABILITY</span><strong>{filmAvailabilityLabel[item.availabilityStatus]}</strong></div><Link className="quick-view-detail" href={`/film/${item.id}`} onClick={onClose}>DETAIL <ArrowUpRight size={16}/></Link></section></div>,document.body);
}

export function FilmCard({film:item}:{film:Film}){
  const {favorites,compare,toggleFavorite,toggleCompare}=useStore();const brand=brandById[item.brandId];
  const [quickView,setQuickView]=useState(false);
  const liked=favorites.films.includes(item.id),selected=compare.films.includes(item.id);
  const status=item.availabilityStatus==="out-of-stock"?"OUT OF STOCK":item.availabilityStatus==="regional"?"REGIONAL":item.catalogStatus==="official-legacy"?"LEGACY":item.catalogStatus==="limited"?"LIMITED":item.catalogStatus==="in-development"?"COMING SOON":item.catalogStatus==="official-current"?"CURRENT":item.catalogStatus==="retail-current"?"RETAIL":"";
  const badges=[item.photographyUse==="motion-picture"?"MOTION STOCK":item.photographyUse==="industrial"?"SPECIAL STOCK":"STILL FILM",item.filmCategory==="effect"?"EFFECT FILM":item.filmCategory==="pre-exposed"||item.treatment==="pre-exposed"?"PRE-EXPOSED":item.filmCategory==="redscale"?"RED SCALE":item.filmCategory==="cinema"?"CINEMA":item.filmCategory==="industrial"?"SPECIAL STOCK":null,item.limitedEdition?"LIMITED":null].filter((value,index,all):value is string=>!!value&&all.indexOf(value)===index).slice(0,3);
  return <article className="catalog-card"><Link href={`/film/${item.id}`} className="card-art-link" aria-label={`${brand.name} ${item.name} 상세보기`}><FilmArt film={item}/></Link>
    <div className="catalog-card-body"><div className="card-brand">{countryFlag(brand.country)} {brand.name.toUpperCase()}{status&&<span className="card-status">{status}</span>}</div>
      <Link href={`/film/${item.id}`} className="card-title">{item.name}</Link>
      <div className="card-essentials"><strong>ISO {item.iso}</strong><span>{filmTypeShort[item.filmType]}</span><span>{item.process}</span></div>
      <div className="film-class-badges">{badges.map(badge=><span key={badge}>{badge}</span>)}</div>
      <p className="card-description">{item.description}</p>
      <div className="card-character"><div className="mini-swatches" aria-label="컬러 프로필">{item.colorProfile.slice(0,3).map((color,index)=><i key={`${color}-${index}`} style={{background:color}}/>)}</div><span>{item.practicalProfile?.recommendedUses?.slice(0,2).map(value=>recommendedUseLabel[value].toUpperCase()).join(" · ")||item.recommendedFor.slice(0,2).join(" · ")}</span></div>
      <div className="card-bottom"><button type="button" className="detail-link quick-view-trigger" onClick={()=>setQuickView(true)}><Eye size={15}/> QUICK VIEW</button><div><button disabled={!selected&&compare.films.length>=4} onClick={()=>toggleCompare("films",item.id)} className={`small-action ${selected?"selected":""}`} aria-label={`${item.name} 비교 ${selected?"해제":"추가"}`} title={selected?"비교 해제":compare.films.length>=4?"최대 4개까지 비교 가능":"비교 추가"}>{selected?<Check size={16}/>:<GitCompareArrows size={16}/>}<span>{selected?"비교됨":"비교 +"}</span></button><button onClick={()=>toggleFavorite("films",item.id)} className={`small-action ${liked?"selected":""}`} aria-label={`${item.name} 캐비닛 ${liked?"저장 해제":"저장"}`} title={liked?"캐비닛에서 꺼내기":"Save to Cabinet"}><Heart size={16} fill={liked?"currentColor":"none"}/></button></div></div>
    </div>{quickView&&<FilmQuickView film={item} onClose={()=>setQuickView(false)}/>}</article>;
}

export function CameraCard({camera:item}:{camera:Camera}){
  const {favorites,compare,toggleFavorite,toggleCompare}=useStore(); const brand=brandById[item.brandId];
  const liked=favorites.cameras.includes(item.id),selected=compare.cameras.includes(item.id);
  return <article className="catalog-card"><Link href={`/camera/${item.id}`} className="card-art-link" aria-label={`${brand.name} ${item.name} 상세보기`}><CameraArt camera={item}/></Link>
    <div className="catalog-card-body"><div className="card-brand">{countryFlag(brand.country)} {brand.name.toUpperCase()} <span>{item.iso?`ISO ${item.iso}`:"ISO —"}</span></div>
      <Link href={`/camera/${item.id}`} className="card-title">{item.name}</Link><div className="camera-feature-line"><span>{cameraTypeLabel[item.cameraType]}</span><span>{cameraExposures(item.exposures)}</span>{item.frameFormat==="half-frame"&&<span>HALF FRAME</span>}{item.flash&&<span><Flashlight size={13}/> 플래시</span>}{item.waterproof&&<span><Droplets size={13}/> 방수</span>}</div>
      <p className="card-description">{item.embeddedFilmName || "필름 별도 장전"}</p><div className="tag-row"><span>{filmTypeShort[item.filmType]}</span><span>{item.process}</span><span className={item.stockStatus==="camera-exclusive"?"tag-accent":""}>{stockLabel[item.stockStatus]}</span></div>
      <div className="card-bottom"><Link href={`/camera/${item.id}`} className="detail-link">카메라 보기 <ArrowUpRight size={15}/></Link><div><button disabled={!selected&&compare.cameras.length>=4} onClick={()=>toggleCompare("cameras",item.id)} className={`small-action ${selected?"selected":""}`} aria-label={`${item.name} 비교 ${selected?"해제":"추가"}`} title={!selected&&compare.cameras.length>=4?"최대 4개까지 비교 가능":undefined}>{selected?<Check size={16}/>:<GitCompareArrows size={16}/>}<span>{selected?"비교됨":"비교 +"}</span></button><button onClick={()=>toggleFavorite("cameras",item.id)} className={`small-action ${liked?"selected":""}`} aria-label={`${item.name} 캐비닛 ${liked?"저장 해제":"저장"}`} title={liked?"캐비닛에서 꺼내기":"Save to Cabinet"}><Heart size={16} fill={liked?"currentColor":"none"}/></button></div></div>
    </div></article>;
}
