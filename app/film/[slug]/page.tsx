import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { films, filmById } from "@/data/films";
import { cameraById } from "@/data/cameras";
import { brandById } from "@/data/brands";
import { FilmArt, ConfidenceBadge } from "@/components/cards";
import { DetailActions } from "@/components/detail-actions";
import { countryFlag } from "@/data/countries";
import { filmTypeLabel, manufacturingLabel, scoreLabels } from "@/lib/format";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return films.map(x=>({slug:x.id}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=filmById[slug];return {title:item?`${brandById[item.brandId].name} ${item.name}`:"필름을 찾을 수 없음",description:item?.description};}
const row=(label:string,value:React.ReactNode)=><div className="spec-row" key={label}><span>{label}</span><b>{value||"공개 정보 없음"}</b></div>;
export default async function Page({params}:Props){
  const {slug}=await params;const item=filmById[slug];if(!item)notFound();const brand=brandById[item.brandId];
  const related=(item.usedInCameras||[]).map(id=>cameraById[id]).filter(Boolean);
  return <div className="container page-shell"><div className="detail-breadcrumb"><Link href="/films">FILMS</Link> / <Link href={`/brand/${brand.id}`}>{brand.name.toUpperCase()}</Link> / {item.name.toUpperCase()}</div>
    <section className="detail-hero"><div><span className="detail-eyebrow">{countryFlag(brand.country)} {brand.name.toUpperCase()} · 35MM FILM</span><h1>{brand.name} {item.name}</h1><p>{item.description}</p><div className="detail-tags"><span>ISO {item.iso}</span><span>{filmTypeLabel[item.filmType]}</span><span>{item.process}</span>{item.balance&&<span>{item.balance.toUpperCase()}</span>}{item.status!=="current"&&<span>{item.status==="discontinued"?"DISCONTINUED":"LIMITED"}</span>}</div><ConfidenceBadge confidence={item.dataConfidence}/><DetailActions kind="films" id={item.id}/></div><div className="detail-art-holder"><FilmArt film={item} large/></div></section>
    <div className="detail-content"><div><section className="content-panel"><h2>필름 정보</h2><div className="spec-list">{[
      row("브랜드",brand.name),row("브랜드 국가",item.brandCountry),row("실제 제조사",item.manufacturer),row("제조 국가",item.manufacturerCountry),row("원판 / Stock",item.stockOrigin),row("ISO",item.iso),row("Exposure Index",item.exposureIndex),row("필름 타입",filmTypeLabel[item.filmType]),row("현상 방식",item.process),row("색온도",item.balance==="daylight"?"Daylight":item.balance==="tungsten"?"Tungsten":undefined),row("DX 코드",item.dxCode===undefined?undefined:item.dxCode?"있음":"없음"),row("입자 고움",`${item.grain} / 5`),row("콘트라스트",`${item.contrast} / 5`),row("채도",`${item.saturation} / 5`),row("노출 관용도",`${item.latitude} / 5`),row("현재 판매 상태",item.status==="current"?"현재 판매":item.status==="discontinued"?"단종":"한정 판매"),row("제조 방식",manufacturingLabel[item.manufacturingType]),row("원판 정보 신뢰도",item.dataConfidence),
    ]}</div></section><section className="content-panel"><h2>이 필름은 누가 만들었나?</h2><div className="relation-grid"><div className="relation-card"><small>BRAND</small><b>{brand.name}</b></div><div className="relation-card"><small>ORIGINAL STOCK</small><b>{item.stockOrigin||"공개되지 않음"}</b></div><div className="relation-card"><small>ACTUAL MANUFACTURER</small><b>{item.manufacturer||"공개되지 않음"}</b></div><div className="relation-card"><small>PROCESS / CONVERSION</small><b>{manufacturingLabel[item.manufacturingType]}</b></div></div>{item.dataConfidence!=="verified"&&<div className="relation-alert">정확한 원판 또는 제조 관계가 공개되지 않은 항목은 추측하지 않았습니다.</div>}</section><section className="content-panel"><h2>이 필름이 들어가는 카메라</h2>{related.length?<div className="related-links">{related.map(camera=><Link key={camera.id} href={`/camera/${camera.id}`}>{brandById[camera.brandId].name} {camera.name}<span>↗</span></Link>)}</div>:<p>현재 연결된 카메라가 없습니다. 같은 ISO라도 동일 필름으로 자동 연결하지 않습니다.</p>}</section></div>
    <aside><section className="content-panel"><h2>특징 프로필</h2><p>품질 순위가 아닌 촬영 적합도와 특성 강도입니다. 입자 고움은 점수가 높을수록 고운 편입니다.</p>{scoreLabels.map(({key,label})=><div className="score-row" key={key}><span>{label}</span><div className="score-track"><i style={{width:`${(item[key] as number)*20}%`}}/></div><b>{item[key] as number}</b></div>)}</section><section className="content-panel"><h2>색감 프로필</h2><div className="swatches">{item.colorProfile.map(color=><div key={color} style={{background:color}} title={color}/>)}</div><p style={{marginTop:15}}>{item.description}</p></section><section className="content-panel"><h2>추천 촬영</h2><div className="tag-row">{item.recommendedFor.map(x=><span key={x}>{x}</span>)}</div></section>{item.sources?.length?<section className="content-panel"><h2>출처</h2><ul className="source-list">{item.sources.map(x=><li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.name}</a></li>)}</ul></section>:null}</aside></div>
  </div>;
}
