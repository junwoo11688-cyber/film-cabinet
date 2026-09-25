"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, Shuffle, Sparkles } from "lucide-react";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { brands, brandById } from "@/data/brands";
import { exclusiveEntries } from "@/data/exclusive";
import { FilmCard, CameraCard, FilmArt } from "@/components/cards";

const popularFilmIds=["kodak-gold-200","kodak-portra-400","fujifilm-400","ilford-hp5-plus-400","cinestill-800t","harman-phoenix-ii-200","lomography-purple","lucky-c200","manual-mc400","flicfilm-aurora-400"];
const popularCameraIds=["kodak-funsaver","fujifilm-quicksnap-flash","fujifilm-quicksnap-bw","ilford-hp5-single-use","agfa-lebox-bw","manual-disposable"];
const stats=[
  {label:"등록 브랜드",value:brands.length},{label:"등록 필름",value:films.length},{label:"카메라",value:cameras.length},
  {label:"전용·희귀 내장필름",value:exclusiveEntries.filter(x=>x.kind!=="available").length},
  {label:"컬러 필름",value:films.filter(x=>x.filmType==="color-negative"||x.filmType==="special-color"||x.filmType==="cinema").length},
  {label:"흑백 필름",value:films.filter(x=>x.filmType==="black-and-white").length},
];
export default function Home(){
  const [query,setQuery]=useState("");const [randomFilm,setRandomFilm]=useState<string|undefined>();const [randomCamera,setRandomCamera]=useState<string|undefined>();
  useEffect(()=>{if(window.location.hash==="#site-search")document.querySelector<HTMLInputElement>("#site-search input")?.focus()},[]);
  const results=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return null;const aliases=(s:string)=>s.toLowerCase().includes(q);
    const matchingFilms=films.filter(x=>aliases(`${x.name} ${brandById[x.brandId].name} ISO ${x.iso} ${x.process} ${x.recommendedFor.join(" ")} ${x.filmType} ${x.filmType==="black-and-white"?"흑백":"컬러"}`));
    const matchingCameras=cameras.filter(x=>aliases(`${x.name} ${brandById[x.brandId].name} ISO ${x.iso} ${x.embeddedFilmName} ${x.filmType} ${x.filmType==="black-and-white"?"흑백":"컬러"}`));
    const matchingBrands=brands.filter(x=>aliases(x.name));
    return {films:matchingFilms.slice(0,5),cameras:matchingCameras.slice(0,4),brands:matchingBrands.slice(0,3),total:matchingFilms.length+matchingCameras.length+matchingBrands.length};
  },[query]);
  const featured=films.find(x=>x.id==="kodak-gold-200")!;
  return <>
    <section className="home-hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> THE ANALOG ENCYCLOPEDIA</div><h1>오늘은 어떤 필름을<br/><em>넣을까?</em></h1><p>브랜드, ISO, 색감, 현상 방식과 촬영 상황별로 35mm 필름과 일회용 카메라를 찾아보세요.</p>
      <div className="hero-search-wrap" id="site-search"><Search size={21}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="필름, 카메라 또는 브랜드 검색" aria-label="필름, 카메라 또는 브랜드 검색"/><kbd>SEARCH</kbd>
      {results&&<div className="search-results" role="region" aria-label="검색 결과"><div className="search-results-heading">검색 결과 · 전체 {results.total}개 (상위 항목 표시)</div>{results.films.map(x=><Link key={x.id} href={`/film/${x.id}`}><span className="result-type">FILM</span><strong>{brandById[x.brandId].name} {x.name}</strong><small>ISO {x.iso} · {x.process}</small></Link>)}{results.cameras.map(x=><Link key={x.id} href={`/camera/${x.id}`}><span className="result-type">CAMERA</span><strong>{brandById[x.brandId].name} {x.name}</strong><small>{x.exposures}컷</small></Link>)}{results.brands.map(x=><Link key={x.id} href={`/brand/${x.id}`}><span className="result-type">BRAND</span><strong>{x.name}</strong><small>{x.country}</small></Link>)}{!results.total&&<p className="no-search">검색 결과가 없습니다. 다른 이름이나 ISO로 찾아보세요.</p>}</div>}</div>
      <div className="quick-tags"><span>빠른 검색</span>{["ISO 400","야경","흑백","Kodak"].map(x=><button key={x} onClick={()=>setQuery(x)}>{x}</button>)}</div>
      <div className="hero-paths"><Link href="/films">필름 찾기 <ArrowRight size={17}/></Link><Link href="/cameras">카메라 찾기 <ArrowRight size={17}/></Link><Link href="/exclusive-films">카메라 전용 필름 <ArrowRight size={17}/></Link></div>
    </div><div className="hero-feature"><div className="hero-feature-header"><span>EDITOR&apos;S PICK / 001</span><span>35MM</span></div><div className="feature-art-wrap"><FilmArt film={featured} large/></div><div className="hero-feature-footer"><div><b>START HERE</b><strong>Kodak Gold 200</strong><span>가장 편안한 첫 롤의 색</span></div><Link href="/film/kodak-gold-200" aria-label="Kodak Gold 200 자세히 보기"><ArrowRight size={24}/></Link></div></div></div></section>
    <section className="stats-strip"><div className="container stats-grid">{stats.map(x=><div key={x.label}><strong>{String(x.value).padStart(2,"0")}</strong><span>{x.label}</span></div>)}</div></section>
    <section className="container section-block"><div className="section-heading"><div><span className="section-kicker">01 / FILM LIBRARY</span><h2>Popular Films</h2><p>색과 성격이 다른 필름을 한눈에 비교해보세요.</p></div><Link href="/films" className="text-link">전체 필름 보기 <ArrowRight size={17}/></Link></div><div className="card-grid">{popularFilmIds.map(id=><FilmCard key={id} film={films.find(x=>x.id===id)!}/>)}</div></section>
    <section className="exclusive-feature"><div className="container exclusive-feature-grid"><div><span className="section-kicker light">02 / INSIDE THE CAMERA</span><h2>카메라 안에서만<br/><em>만날 수 있는 필름.</em></h2><p>일반 롤로 별도 구매하기 어렵거나 정확한 원판이 공개되지 않은 내장 필름을 모았습니다.</p><Link href="/exclusive-films" className="light-button">Exclusive Films 탐색 <ArrowRight size={18}/></Link></div><div className="exclusive-mini-grid"><div><small>CAMERA EXCLUSIVE</small><b>Kodak ISO 800</b><span>FunSaver · Power Flash · Sport</span></div><div><small>CAMERA EXCLUSIVE</small><b>QuickSnap B&W 400</b><span>C-41로 현상하는 흑백</span></div><div><small>STOCK UNKNOWN</small><b>LeBox Color 400</b><span>정확한 원판 정보 비공개</span></div></div></div></section>
    <section className="container section-block"><div className="section-heading"><div><span className="section-kicker">03 / SINGLE USE ARCHIVE</span><h2>Popular Cameras</h2><p>내장 필름과 촬영 조건까지 함께 확인하세요.</p></div><Link href="/cameras" className="text-link">전체 카메라 보기 <ArrowRight size={17}/></Link></div><div className="card-grid">{popularCameraIds.map(id=><CameraCard key={id} camera={cameras.find(x=>x.id===id)!}/>)}</div></section>
    <section className="container discovery-band"><div><span className="section-kicker">CHANCE ENCOUNTER</span><h2>결정이 어렵다면, 우연에 맡겨보세요.</h2><p>새로운 필름과 카메라를 한 장씩 꺼내드립니다.</p></div><div className="random-actions"><button onClick={()=>setRandomFilm(films[Math.floor(Math.random()*films.length)].id)}><Shuffle size={18}/> 오늘 뭐 넣지?</button><button onClick={()=>setRandomCamera(cameras.filter(x=>x.cameraType==="single-use")[Math.floor(Math.random()*cameras.filter(x=>x.cameraType==="single-use").length)].id)}><Sparkles size={18}/> 오늘 뭐 들고 나가지?</button></div>{(randomFilm||randomCamera)&&<div className="random-result">{randomFilm&&<Link href={`/film/${randomFilm}`}>오늘의 필름 <b>{brandById[films.find(x=>x.id===randomFilm)!.brandId].name} {films.find(x=>x.id===randomFilm)!.name}</b><ArrowRight size={16}/></Link>}{randomCamera&&<Link href={`/camera/${randomCamera}`}>오늘의 카메라 <b>{brandById[cameras.find(x=>x.id===randomCamera)!.brandId].name} {cameras.find(x=>x.id===randomCamera)!.name}</b><ArrowRight size={16}/></Link>}</div>}</section>
  </>;
}
