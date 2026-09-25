import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { films, filmById } from "@/data/films";
import { cameraById } from "@/data/cameras";
import { brandById } from "@/data/brands";
import { FilmArt, ConfidenceBadge, FilmStatusBadges } from "@/components/cards";
import { DetailActions } from "@/components/detail-actions";
import { DetailTabs } from "@/components/detail-tabs";
import { countryFlag } from "@/data/countries";
import { filmTypeLabel, manufacturingLabel, scoreLabels, catalogStatusLabel, filmAvailabilityLabel } from "@/lib/format";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return films.map(x=>({slug:x.id}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=filmById[slug];return {title:item?`${brandById[item.brandId].name} ${item.name}`:"필름을 찾을 수 없음",description:item?.description};}
const row=(label:string,value:React.ReactNode)=><div className="spec-row" key={label}><span>{label}</span><b>{value||"공개 정보 없음"}</b></div>;

export default async function Page({params}:Props){
  const {slug}=await params;const item=filmById[slug];if(!item)notFound();
  const brand=brandById[item.brandId];
  const related=(item.usedInCameras||[]).map(id=>cameraById[id]).filter(Boolean);
  const tabs=[
    {id:"overview",label:"OVERVIEW",content:<div className="detail-overview-grid"><section className="content-panel"><span className="panel-kicker">THE LOOK</span><h2>이 필름의 색과 성격</h2><p>{item.description}</p><div className="swatches cabinet-swatches">{item.colorProfile.map((color,index)=><div key={`${color}-${index}`} style={{background:color}} title={color}/>)}</div>{item.profileEstimated&&<p className="subtle-note">컬러 블록은 자체 그래픽입니다. 실제 발색 자료는 확인 중입니다.</p>}<h3>이런 장면에 어울려요</h3><div className="tag-row">{item.recommendedFor.map(x=><span key={x}>{x}</span>)}</div></section><section className="content-panel"><span className="panel-kicker">CHARACTER PROFILE</span><h2>특성 한눈에 보기</h2><p className="subtle-note">품질 순위가 아닌 촬영 특성과 적합도의 강도입니다. 입자 고움은 높을수록 고운 편입니다.</p>{item.profileEstimated?<p>촬영 특성 점수는 아직 충분히 검증되지 않아 표시하지 않습니다.</p>:<div className="score-list">{scoreLabels.map(({key,label})=><div className="score-row" key={key}><span>{label}</span><div className="score-track" role="meter" aria-label={label} aria-valuemin={1} aria-valuemax={5} aria-valuenow={item[key] as number}><i style={{width:`${(item[key] as number)*20}%`}}/></div><b>{item[key] as number}/5</b></div>)}</div>}</section></div>},
    {id:"specs",label:"SPECS",content:<div className="detail-tab-grid"><section className="content-panel"><span className="panel-kicker">TECHNICAL SHEET</span><h2>기본 사양</h2><div className="spec-list">{[row("ISO",item.iso),row("Exposure Index",item.exposureIndex),row("Film Type",filmTypeLabel[item.filmType]),row("Process",item.process),row("Color Balance",item.balance==="daylight"?"Daylight":item.balance==="tungsten"?"Tungsten":undefined),row("DX Code",item.dxCode===undefined?undefined:item.dxCode?"있음":"없음"),row("Available Exposures",item.availableExposures?.join(" / ")),row("Package Variants",item.packageVariants?.join(" / "))]}</div></section><section className="content-panel"><span className="panel-kicker">CURRENT STATUS</span><h2>제품과 판매 상태</h2><div className="spec-list">{[row("Catalog",catalogStatusLabel[item.catalogStatus]),row("Availability",filmAvailabilityLabel[item.availabilityStatus]),row("Markets",item.marketRegions?.join(" · ")||"확인 필요"),row("Last Verified",item.availabilityCheckedAt||"확인 필요"),row("Product Status",item.status)]}</div><p className="subtle-note">공식 목록에 있는지와 지금 구매할 수 있는지는 다른 정보입니다. 품절이 곧 단종은 아닙니다.</p></section></div>},
    {id:"origin",label:"ORIGIN",content:<div className="detail-tab-grid"><section className="content-panel origin-panel"><span className="panel-kicker">TRACE THE STOCK</span><h2>이 필름은 어디서 왔을까?</h2><div className="origin-flow"><div><small>01 / BRAND</small><strong>{brand.name}</strong><span>{countryFlag(brand.country)} {item.brandCountry}</span></div><span aria-hidden="true">↓</span><div><small>02 / MANUFACTURER</small><strong>{item.manufacturer||"UNKNOWN"}</strong><span>{item.manufacturerCountry||"제조국 미공개"}</span></div><span aria-hidden="true">↓</span><div><small>03 / ORIGINAL STOCK</small><strong>{item.stockOrigin||"UNKNOWN"}</strong></div><span aria-hidden="true">↓</span><div><small>04 / CONVERSION / RESPOOL</small><strong>{manufacturingLabel[item.manufacturingType]}</strong></div></div><div className="origin-confidence"><ConfidenceBadge confidence={item.dataConfidence}/><span>원판과 제조 관계가 공개되지 않았다면 추정하지 않습니다.</span></div></section><aside className="content-panel"><span className="panel-kicker">SOURCE NOTES</span><h2>확인 근거</h2>{item.sources?.length?<ul className="source-list">{item.sources.map(x=><li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.name} ↗</a><small>{x.sourceTier||"source"}</small></li>)}</ul>:<p>공개 출처가 아직 등록되지 않았습니다.</p>}<div className="spec-list">{[row("브랜드 국가",item.brandCountry),row("제조 국가",item.manufacturerCountry),row("제조 방식",manufacturingLabel[item.manufacturingType])]}</div></aside></div>},
    {id:"cameras",label:"CAMERAS",content:<section className="content-panel"><span className="panel-kicker">FILM × CAMERA</span><h2>이 필름이 들어가는 카메라</h2>{related.length?<div className="related-links">{related.map(camera=><Link key={camera.id} href={`/camera/${camera.id}`}>{brandById[camera.brandId].name} {camera.name}<ArrowRight size={18}/></Link>)}</div>:<div className="quiet-empty"><p>이 필름이 기본 탑재된 등록 카메라는 없습니다.</p><small>같은 ISO라는 이유만으로 동일한 필름에 연결하지 않습니다.</small></div>}</section>},
  ];
  return <div className="container page-shell cabinet-detail-page"><div className="detail-breadcrumb"><Link href="/films">Films</Link> / <Link href={`/brand/${brand.id}`}>{brand.name}</Link> / {item.name}</div>
    <section className="cabinet-detail-hero"><div><span className="detail-eyebrow">{countryFlag(brand.country)} {brand.name.toUpperCase()} · 35MM FILM</span><h1>{item.name}</h1><div className="detail-tags"><span>ISO {item.iso}</span><span>{filmTypeLabel[item.filmType]}</span><span>{item.process}</span></div><p>{item.description}</p><FilmStatusBadges film={item}/><DetailActions kind="films" id={item.id}/></div><div className="detail-art-holder"><FilmArt film={item} large/></div></section>
    <DetailTabs items={tabs}/>
  </div>;
}
