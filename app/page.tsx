"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Camera, Film as FilmIcon, Search, Shuffle, Sparkles } from "lucide-react";
import { films, filmById } from "@/data/films";
import { cameras, cameraById } from "@/data/cameras";
import { brands, brandById } from "@/data/brands";
import { exclusiveEntries } from "@/data/exclusive";
import { FilmArt, FilmCard, CameraCard } from "@/components/cards";
import { buyableAvailability } from "@/lib/format";

const featuredFilms = ["kodak-gold-200","kodak-portra-400","fujifilm-400","ilford-hp5-plus-400","cinestill-800t","harman-phoenix-ii-200","lomography-purple","lucky-c200"];
const featuredCameras = ["kodak-funsaver","fujifilm-quicksnap-flash","ilford-hp5-single-use","manual-disposable"];
const openSearch = () => window.dispatchEvent(new Event("open-film-cabinet-search"));

export default function Home() {
  const [onlyAvailable,setOnlyAvailable] = useState(false);
  const [randomId,setRandomId] = useState<string>();
  const [randomCameraId,setRandomCameraId] = useState<string>();
  const drawFilm = () => { const pool=onlyAvailable?films.filter(x=>buyableAvailability.includes(x.availabilityStatus)):films;setRandomId(pool[Math.floor(Math.random()*pool.length)]?.id); };
  const drawCamera = () => { const pool=cameras.filter(x=>x.cameraType==="single-use");setRandomCameraId(pool[Math.floor(Math.random()*pool.length)]?.id); };
  const randomFilm=randomId?filmById[randomId]:undefined;
  const randomCamera=randomCameraId?cameraById[randomCameraId]:undefined;
  return <>
    <section className="home-hero"><div className="container cabinet-hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> 35MM FILM & CAMERA ARCHIVE</div><h1>오늘은 어떤 필름을<br/><em>넣을까?</em></h1><p>브랜드, ISO, 색감, 현상 방식과 촬영 상황별로 필름과 카메라를 찾아보세요.</p>
        <button className="hero-search-trigger" type="button" onClick={openSearch} aria-label="필름, 카메라, 브랜드, ISO 검색 열기"><Search size={21}/><span>Kodak Gold 200, ISO 400, QuickSnap...</span><kbd>⌘ K</kbd></button>
        <p className="hero-hint">처음이라면 아래에서 필름, 카메라, 촬영 상황 중 하나를 골라보세요.</p>
      </div>
      <div className="cabinet-feature"><div className="cabinet-feature-label"><span>FROM THE CABINET</span><span>01 / 135</span></div><FilmArt film={filmById["kodak-gold-200"]} large/><Link href="/film/kodak-gold-200">첫 롤로 편한 Kodak Gold 200 <ArrowRight size={18}/></Link></div>
    </div></section>
    <section className="container quick-entry" aria-label="빠른 탐색">
      <Link href="/films" className="entry-card"><span className="entry-icon"><FilmIcon size={25}/></span><strong>필름 찾기</strong><small>브랜드, ISO, 색감으로 탐색</small><ArrowRight className="entry-arrow" size={18}/></Link>
      <Link href="/cameras" className="entry-card"><span className="entry-icon"><Camera size={25}/></span><strong>일회용 카메라</strong><small>FunSaver, QuickSnap 그리고 더 많은 카메라</small><ArrowRight className="entry-arrow" size={18}/></Link>
      <Link href="/discover" className="entry-card"><span className="entry-icon"><Sparkles size={25}/></span><strong>특이한 필름</strong><small>특수 컬러와 카메라 전용 필름</small><ArrowRight className="entry-arrow" size={18}/></Link>
      <button className="entry-card" type="button" onClick={drawFilm}><span className="entry-icon"><Shuffle size={25}/></span><strong>오늘 뭐 넣지?</strong><small>랜덤으로 한 롤 추천</small><ArrowRight className="entry-arrow" size={18}/></button>
    </section>
    {randomFilm && <section className="container quick-random" aria-live="polite"><div><span className="section-kicker">TODAY&apos;S ROLL</span><h2>{brandById[randomFilm.brandId].name} {randomFilm.name}</h2><p>ISO {randomFilm.iso} · {randomFilm.process} · {randomFilm.recommendedFor.slice(0,2).join(" / ")}</p></div><div><button type="button" onClick={drawFilm}>다시 뽑기</button><Link href={`/film/${randomFilm.id}`}>상세보기 <ArrowRight size={16}/></Link></div></section>}
    <div className="container compact-stats"><span><b>{films.length}</b> Films</span><span><b>{brands.length}</b> Brands</span><span><b>{cameras.length}</b> Cameras</span><span><b>{exclusiveEntries.filter(x=>x.kind!=="available").length}</b> Hidden Stocks</span></div>
    <section className="container section-block"><div className="section-heading"><div><span className="section-kicker">OPEN A DRAWER</span><h2>많이 찾는 필름</h2><p>이름과 색감을 보고, 마음에 드는 한 롤을 꺼내보세요.</p></div><Link href="/films" className="text-link">모든 필름 보기 <ArrowRight size={17}/></Link></div><div className="card-grid">{featuredFilms.map(id=><FilmCard key={id} film={filmById[id]}/>)}</div></section>
    <section className="container home-discover"><div><span className="section-kicker">THERE IS MORE INSIDE</span><h2>카메라 안의 필름까지 들여다보세요.</h2><p>일반 롤로 살 수 없는 필름, 정확한 원판이 공개되지 않은 필름을 따로 모았습니다.</p></div><Link href="/exclusive-films">카메라 전용 필름 보기 <ArrowRight size={18}/></Link></section>
    <section className="container section-block"><div className="section-heading"><div><span className="section-kicker">PICK UP A CAMERA</span><h2>가볍게 들고 나가는 카메라</h2><p>내장 필름과 촬영 조건을 함께 확인하세요.</p></div><Link href="/cameras" className="text-link">모든 카메라 보기 <ArrowRight size={17}/></Link></div><div className="card-grid">{featuredCameras.map(id=><CameraCard key={id} camera={cameraById[id]}/>)}</div></section>
    <section className="container home-final-cta"><span className="section-kicker">CAN&apos;T DECIDE?</span><h2>오늘의 한 롤을 뽑아볼까요?</h2><label className="random-availability"><input type="checkbox" checked={onlyAvailable} onChange={event=>setOnlyAvailable(event.target.checked)}/> 지금 살 수 있는 필름만</label><div><button type="button" onClick={drawFilm}><Shuffle size={18}/> Random Film</button><button type="button" className="secondary-random" onClick={drawCamera}><Camera size={18}/> Random Camera</button><Link href="/films">Explore all films <ArrowRight size={17}/></Link></div>{(randomFilm||randomCamera)&&<p className="cta-result">{randomFilm&&<Link href={`/film/${randomFilm.id}`}>오늘의 필름: {brandById[randomFilm.brandId].name} {randomFilm.name} ↗</Link>}{randomCamera&&<Link href={`/camera/${randomCamera.id}`}>오늘의 카메라: {brandById[randomCamera.brandId].name} {randomCamera.name} ↗</Link>}</p>}</section>
  </>;
}
