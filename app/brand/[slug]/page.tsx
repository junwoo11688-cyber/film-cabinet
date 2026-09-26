import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, brandById } from "@/data/brands";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { countryFlag } from "@/data/countries";
import { FilmCard, CameraCard } from "@/components/cards";
import type { Film } from "@/data/types";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return brands.map(x=>({slug:x.id}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const brand=brandById[slug];return {title:brand?.name||"브랜드를 찾을 수 없음",description:brand?.character};}
function FilmSection({title,list}:{title:string;list:Film[]}){if(!list.length)return null;return <section className="brand-section"><div className="section-heading"><div><span className="section-kicker">{title}</span><h2>{title === "LEGACY" ? "보존된 기록" : `${title} FILMS`}</h2></div><small>{list.length} films</small></div><div className="card-grid">{list.map(item=><FilmCard key={item.id} film={item}/>)}</div></section>}
export default async function Page({params}:Props){
  const {slug}=await params;const brand=brandById[slug];if(!brand)notFound();
  const ownFilms=films.filter(x=>x.brandId===brand.id);
  const ownCameras=cameras.filter(x=>x.brandId===brand.id);
  const legacy=ownFilms.filter(x=>x.catalogStatus==="official-legacy"||x.status==="discontinued");
  const current=ownFilms.filter(x=>!legacy.includes(x)&&!x.comingSoon&&x.catalogStatus!=="in-development");
  const color=current.filter(x=>["color-negative","special-color","redscale","cinema"].includes(x.filmType));
  const bw=current.filter(x=>x.filmType==="black-and-white");
  const slide=current.filter(x=>x.filmType==="slide");
  return <div className="container page-shell brand-page"><div className="detail-breadcrumb"><Link href="/films">Films</Link> / <Link href="/brands">Brands</Link> / {brand.name}</div><header className="brand-hero"><div><span className="section-kicker">{countryFlag(brand.country)} {brand.country.toUpperCase()} · {brand.form.toUpperCase()}</span><h1>{brand.name}</h1><p>{brand.character}</p></div><div className="brand-metrics"><div><b>{current.length}</b><span>Current Films</span></div><div><b>{ownCameras.length}</b><span>Cameras</span></div><div><b>{legacy.length}</b><span>Legacy</span></div></div></header><div className="brand-origin-summary"><span><b>브랜드 형태</b>{brand.form}</span><span><b>자체 제조</b>{brand.makesFilm?"자체 제조 제품 있음":"제품별 확인 필요"}</span>{brand.originCountry&&<span><b>Origin</b>{brand.originCountry}</span>}{brand.currentOperatorCountry&&<span><b>Current operation</b>{brand.currentOperatorCountry}</span>}{brand.manufacturer&&<span><b>실제 제조사</b>{brand.manufacturer}</span>}{brand.parentCompany&&<span><b>운영 / 모회사</b>{brand.parentCompany}</span>}</div>
    <FilmSection title="COLOR" list={color}/><FilmSection title="BLACK & WHITE" list={bw}/><FilmSection title="SLIDE" list={slide}/><FilmSection title="LEGACY" list={legacy}/>
    {ownCameras.length>0&&<section className="brand-section"><div className="section-heading"><div><span className="section-kicker">CAMERA ARCHIVE</span><h2>Single Use & Reusable</h2></div><small>{ownCameras.length} cameras</small></div><div className="card-grid">{ownCameras.map(item=><CameraCard key={item.id} camera={item}/>)}</div></section>}
    {!ownFilms.length&&!ownCameras.length&&<div className="empty-state"><h3>등록된 제품 정보가 없습니다.</h3><p>브랜드 기록은 유지하며 확인된 제품을 기다리고 있습니다.</p></div>}
    {ownCameras.some(x=>x.stockStatus==="camera-exclusive")&&<div className="guide-note"><Link href="/exclusive-films">이 브랜드의 카메라 전용 필름 살펴보기 ↗</Link></div>}
  </div>;
}
