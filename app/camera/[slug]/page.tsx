import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cameras, cameraById } from "@/data/cameras";
import { filmById } from "@/data/films";
import { brandById } from "@/data/brands";
import { CameraArt, ConfidenceBadge } from "@/components/cards";
import { DetailActions } from "@/components/detail-actions";
import { countryFlag } from "@/data/countries";
import { availabilityLabel, cameraTypeLabel, filmTypeLabel, stockLabel, cameraIso, cameraExposures } from "@/lib/format";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return cameras.map(x=>({slug:x.id}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=cameraById[slug];return {title:item?`${brandById[item.brandId].name} ${item.name}`:"카메라를 찾을 수 없음",description:item?.notes||`${item?.name}의 내장 필름, ISO, 플래시, 방수와 별도 필름 구매 정보를 확인하세요.`};}
const row=(label:string,value:React.ReactNode)=><div className="spec-row" key={label}><span>{label}</span><b>{value||"공개 정보 없음"}</b></div>;
export default async function Page({params}:Props){
  const {slug}=await params;const item=cameraById[slug];if(!item)notFound();const brand=brandById[item.brandId];const linked=item.linkedFilmId?filmById[item.linkedFilmId]:undefined;
  return <div className="container page-shell"><div className="detail-breadcrumb"><Link href="/cameras">CAMERAS</Link> / <Link href={`/brand/${brand.id}`}>{brand.name.toUpperCase()}</Link> / {item.name.toUpperCase()}</div>
    <section className="detail-hero"><div><span className="detail-eyebrow">{countryFlag(brand.country)} {brand.name.toUpperCase()} · {cameraTypeLabel[item.cameraType].toUpperCase()}</span><h1>{brand.name} {item.name}</h1><p>{item.notes||`${item.exposures}컷의 35mm ${filmTypeLabel[item.filmType]} 카메라. 내장 필름과 촬영 조건을 확인해보세요.`}</p><div className="detail-tags"><span>{cameraIso(item.iso)}</span><span>{cameraExposures(item.exposures)}</span><span>{item.process}</span><span>{item.flash?"FLASH":"NO FLASH"}</span>{item.waterproof&&<span>WATERPROOF {item.waterproofDepth?`${item.waterproofDepth}M`:""}</span>}</div><ConfidenceBadge confidence={item.dataConfidence}/><DetailActions kind="cameras" id={item.id}/></div><div className="detail-art-holder"><CameraArt camera={item} large/></div></section>
    <div className="detail-content"><div><section className="content-panel"><h2>카메라 정보</h2><div className="spec-list">{[
      row("브랜드",brand.name),row("브랜드 국가",item.country),row("카메라 종류",cameraTypeLabel[item.cameraType]),row("필름 포맷",item.filmFormat),row("ISO",item.iso||"필름에 따라 다름"),row("컷 수",cameraExposures(item.exposures)),row("필름 타입",filmTypeLabel[item.filmType]),row("현상 방식",item.process),row("플래시",item.flash?"있음":"없음"),row("방수",item.waterproof?item.waterproofDepth?`${item.waterproofDepth}m`:"있음 · 깊이 미확인":"없음"),row("재장전",item.reloadable?"가능":"불가"),row("내장 필름",item.embeddedFilmName),row("렌즈",item.lens),row("조리개",item.aperture),row("셔터",item.shutter),
    ]}</div></section><section className="content-panel"><h2>안에 들어 있는 필름</h2><div className="relation-grid"><div className="relation-card"><small>EMBEDDED FILM</small><b>{item.embeddedFilmName||"별도 장전"}</b></div><div className="relation-card"><small>STOCK STATUS</small><b>{stockLabel[item.stockStatus]}</b></div><div className="relation-card"><small>STANDALONE ROLL</small><b>{availabilityLabel[item.standaloneFilmAvailability]}</b></div><div className="relation-card"><small>EXACT FILM MATCH</small><b>{item.exactFilmMatch?"확인된 동일 필름":"확인되지 않음"}</b></div></div>{item.stockStatus==="camera-exclusive"?<div className="relation-alert">이 필름은 일반 롤로 동일 제품을 구매할 수 없는 것으로 분류했습니다. 이 카메라에서만 경험할 수 있습니다.</div>:item.stockStatus==="unknown-stock"?<div className="relation-alert">정확한 원판 정보는 공개되지 않았습니다. ISO가 같다는 이유로 다른 필름과 연결하지 않습니다.</div>:null}{linked&&<div className="related-links" style={{marginTop:14}}><Link href={`/film/${linked.id}`}>{brandById[linked.brandId].name} {linked.name} 필름 보기 <span>↗</span></Link></div>}</section></div>
    <aside><section className="content-panel"><h2>아카이브 분류</h2><div className="tag-row"><span>{cameraTypeLabel[item.cameraType]}</span><span>{stockLabel[item.stockStatus]}</span>{item.filmEffect==="pre-exposed"&&<span>PRE-EXPOSED EFFECT</span>}</div><p>{item.reloadable?"촬영 후 새 필름을 장전할 수 있는 카메라입니다.":"사용 후 현상소에 카메라째 맡기는 일회용 제품입니다."}</p></section><section className="content-panel"><h2>촬영 결과를 만드는 요소</h2><p>같은 필름이어도 렌즈, 고정 셔터, 조리개, 플래시의 차이로 사진의 색과 선명도가 달라집니다.</p><Link href="/guide" className="text-link">가이드에서 자세히 보기 ↗</Link></section>{item.sources?.length?<section className="content-panel"><h2>출처</h2><ul className="source-list">{item.sources.map(x=><li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.name}</a></li>)}</ul></section>:null}</aside></div>
  </div>;
}
