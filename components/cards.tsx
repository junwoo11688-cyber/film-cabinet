"use client";

import Link from "next/link";
import { Heart, Check, ArrowUpRight, Flashlight, Droplets, GitCompareArrows } from "lucide-react";
import { Film, Camera, Confidence } from "@/data/types";
import { brandById } from "@/data/brands";
import { countryFlag } from "@/data/countries";
import { confidenceLabel, filmTypeShort, stockLabel, cameraTypeLabel, cameraExposures, catalogStatusLabel, filmAvailabilityLabel } from "@/lib/format";
import { useStore } from "./store";

export function ConfidenceBadge({confidence}:{confidence:Confidence}){return <span className={`confidence ${confidence}`}>{confidenceLabel[confidence]}</span>}
export function FilmStatusBadges({film:item}:{film:Film}){return <div className="film-status-row"><span className={`film-status catalog-${item.catalogStatus}`}>{catalogStatusLabel[item.catalogStatus]}</span><span className={`film-status availability-${item.availabilityStatus}`}>{filmAvailabilityLabel[item.availabilityStatus]}{(item.availabilityStatus==="regional"||item.availabilityStatus==="preorder")&&item.marketRegions?.length?` · ${item.marketRegions.join(", ").toUpperCase()}`:""}</span></div>}

export function FilmArt({film:item,large=false}:{film:Film;large?:boolean}){
  const brand=brandById[item.brandId];
  const artColor=item.colorProfile[0]||brand.color;
  return <div className={`film-art ${large?"large":""}`} style={{"--art-color":artColor,"--brand-accent":brand.color} as React.CSSProperties} aria-hidden="true">
    <div className="film-art-top"><span>{brand.name.toUpperCase()}</span><span>35MM / 135</span></div>
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

export function FilmCard({film:item}:{film:Film}){
  const {favorites,compare,toggleFavorite,toggleCompare}=useStore();const brand=brandById[item.brandId];
  const liked=favorites.films.includes(item.id),selected=compare.films.includes(item.id);
  const status=item.availabilityStatus==="out-of-stock"?"OUT OF STOCK":item.availabilityStatus==="regional"?"REGIONAL":item.catalogStatus==="official-legacy"?"LEGACY":item.catalogStatus==="official-current"?"CURRENT":item.catalogStatus==="retail-current"?"RETAIL":"";
  return <article className="catalog-card"><Link href={`/film/${item.id}`} className="card-art-link" aria-label={`${brand.name} ${item.name} 상세보기`}><FilmArt film={item}/></Link>
    <div className="catalog-card-body"><div className="card-brand">{countryFlag(brand.country)} {brand.name.toUpperCase()}{status&&<span className="card-status">{status}</span>}</div>
      <Link href={`/film/${item.id}`} className="card-title">{item.name}</Link>
      <div className="card-essentials"><strong>ISO {item.iso}</strong><span>{filmTypeShort[item.filmType]}</span><span>{item.process}</span></div>
      <p className="card-description">{item.description}</p>
      <div className="card-character"><div className="mini-swatches" aria-label="컬러 프로필">{item.colorProfile.slice(0,3).map((color,index)=><i key={`${color}-${index}`} style={{background:color}}/>)}</div><span>{item.recommendedFor.slice(0,2).join(" · ")}</span></div>
      <div className="card-bottom"><Link href={`/film/${item.id}`} className="detail-link">살펴보기 <ArrowUpRight size={15}/></Link><div><button disabled={!selected&&compare.films.length>=4} onClick={()=>toggleCompare("films",item.id)} className={`small-action ${selected?"selected":""}`} aria-label={`${item.name} 비교 ${selected?"해제":"추가"}`} title={selected?"비교 해제":compare.films.length>=4?"최대 4개까지 비교 가능":"비교 추가"}>{selected?<Check size={16}/>:<GitCompareArrows size={16}/>}<span>{selected?"비교됨":"비교 +"}</span></button><button onClick={()=>toggleFavorite("films",item.id)} className={`small-action ${liked?"selected":""}`} aria-label={`${item.name} 캐비닛 ${liked?"저장 해제":"저장"}`} title={liked?"캐비닛에서 꺼내기":"Save to Cabinet"}><Heart size={16} fill={liked?"currentColor":"none"}/></button></div></div>
    </div></article>;
}

export function CameraCard({camera:item}:{camera:Camera}){
  const {favorites,compare,toggleFavorite,toggleCompare}=useStore(); const brand=brandById[item.brandId];
  const liked=favorites.cameras.includes(item.id),selected=compare.cameras.includes(item.id);
  return <article className="catalog-card"><Link href={`/camera/${item.id}`} className="card-art-link" aria-label={`${brand.name} ${item.name} 상세보기`}><CameraArt camera={item}/></Link>
    <div className="catalog-card-body"><div className="card-brand">{countryFlag(brand.country)} {brand.name.toUpperCase()} <span>{item.iso?`ISO ${item.iso}`:"ISO —"}</span></div>
      <Link href={`/camera/${item.id}`} className="card-title">{item.name}</Link><div className="camera-feature-line"><span>{cameraTypeLabel[item.cameraType]}</span><span>{cameraExposures(item.exposures)}</span>{item.flash&&<span><Flashlight size={13}/> 플래시</span>}{item.waterproof&&<span><Droplets size={13}/> 방수</span>}</div>
      <p className="card-description">{item.embeddedFilmName || "필름 별도 장전"}</p><div className="tag-row"><span>{filmTypeShort[item.filmType]}</span><span>{item.process}</span><span className={item.stockStatus==="camera-exclusive"?"tag-accent":""}>{stockLabel[item.stockStatus]}</span></div>
      <div className="card-bottom"><Link href={`/camera/${item.id}`} className="detail-link">카메라 보기 <ArrowUpRight size={15}/></Link><div><button disabled={!selected&&compare.cameras.length>=4} onClick={()=>toggleCompare("cameras",item.id)} className={`small-action ${selected?"selected":""}`} aria-label={`${item.name} 비교 ${selected?"해제":"추가"}`} title={!selected&&compare.cameras.length>=4?"최대 4개까지 비교 가능":undefined}>{selected?<Check size={16}/>:<GitCompareArrows size={16}/>}<span>{selected?"비교됨":"비교 +"}</span></button><button onClick={()=>toggleFavorite("cameras",item.id)} className={`small-action ${liked?"selected":""}`} aria-label={`${item.name} 캐비닛 ${liked?"저장 해제":"저장"}`} title={liked?"캐비닛에서 꺼내기":"Save to Cabinet"}><Heart size={16} fill={liked?"currentColor":"none"}/></button></div></div>
    </div></article>;
}
