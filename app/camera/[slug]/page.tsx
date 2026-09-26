import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cameras, cameraById } from "@/data/cameras";
import { filmById } from "@/data/films";
import { exclusiveEntries } from "@/data/exclusive";
import { brandById } from "@/data/brands";
import { CameraArt, ConfidenceBadge } from "@/components/cards";
import { DetailActions } from "@/components/detail-actions";
import { DetailTabs } from "@/components/detail-tabs";
import { countryFlag } from "@/data/countries";
import { availabilityLabel, cameraTypeLabel, filmTypeLabel, stockLabel, cameraIso, cameraExposures } from "@/lib/format";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return cameras.map(x=>({slug:x.id}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=cameraById[slug];return {title:item?`${brandById[item.brandId].name} ${item.name}`:"카메라를 찾을 수 없음",description:item?.notes||`${item?.name}의 내장 필름, ISO, 플래시와 방수 정보를 확인하세요.`};}
const row=(label:string,value:React.ReactNode)=><div className="spec-row" key={label}><span>{label}</span><b>{value||"공개 정보 없음"}</b></div>;

export default async function Page({params}:Props){
  const {slug}=await params;const item=cameraById[slug];if(!item)notFound();
  const brand=brandById[item.brandId];
  const linked=item.linkedFilmId?filmById[item.linkedFilmId]:undefined;
  const exclusive=exclusiveEntries.find(x=>x.cameraIds.includes(item.id));
  const tabs=[
    {id:"overview",label:"OVERVIEW",content:<div className="detail-overview-grid"><section className="content-panel"><span className="panel-kicker">THE CAMERA</span><h2>가볍게 들고 나가세요</h2><p>{item.notes||`${cameraExposures(item.exposures)}의 35mm ${filmTypeLabel[item.filmType]} 카메라입니다.`}</p><div className="camera-key-facts"><div><small>ISO</small><b>{item.iso||"미확인"}</b></div><div><small>EXPOSURES</small><b>{cameraExposures(item.exposures)}</b></div><div><small>FLASH</small><b>{item.flash?"있음":"없음"}</b></div><div><small>WATERPROOF</small><b>{item.waterproof?item.waterproofDepth?`${item.waterproofDepth}m`:"있음":"없음"}</b></div></div></section><section className="content-panel"><span className="panel-kicker">HOW IT WORKS</span><h2>카메라의 성격</h2><p>{item.reloadable?"촬영 후 새 필름을 장전할 수 있는 카메라입니다.":"촬영 후 카메라째 현상소에 맡기는 일회용 제품입니다."}</p><p>같은 필름이어도 렌즈, 고정 셔터, 조리개, 플래시의 차이로 사진의 인상이 달라집니다.</p><Link href="/guide" className="text-link">촬영 용어 알아보기 <ArrowRight size={16}/></Link></section></div>},
    {id:"film-inside",label:"FILM INSIDE",content:<div className="detail-tab-grid"><section className="content-panel film-inside-panel"><span className="panel-kicker">INSIDE THIS CAMERA</span><h2>{item.embeddedFilmName||"필름 별도 장전"}</h2><span className={`inside-badge ${item.stockStatus}`}>{stockLabel[item.stockStatus]}</span><div className="spec-list">{[row("Standalone Roll",availabilityLabel[item.standaloneFilmAvailability]),row("Original Stock",linked?.stockOrigin||"공개되지 않음"),row("Process",item.process),row("Exact Film Match",item.exactFilmMatch?"확인됨":"확인되지 않음")]}</div>{item.stockStatus==="camera-exclusive"?<p className="relation-alert">동일한 필름을 일반 롤로 따로 구매할 수 없는 것으로 분류했습니다.</p>:item.stockStatus==="unknown-stock"?<p className="relation-alert">정확한 원판 정보는 공개되지 않았습니다. 다른 제품과 동일하다고 추정하지 않습니다.</p>:null}<div className="inside-actions">{linked&&<Link href={`/film/${linked.id}`} className="primary-button">같은 필름 보기 <ArrowRight size={17}/></Link>}{exclusive&&<Link href={`/exclusive-films/${exclusive.id}`} className="outline-button">카메라 속 필름 알아보기 <ArrowRight size={17}/></Link>}</div></section><aside className="content-panel"><span className="panel-kicker">SOURCE CONFIDENCE</span><h2>어디까지 확인됐나요?</h2><ConfidenceBadge confidence={item.dataConfidence}/><p>정확한 일반 롤과의 연결은 공식 정보로 같은 원판이 확인되는 경우에만 표시합니다.</p>{item.sources?.length?<ul className="source-list">{item.sources.map(x=><li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.name} ↗</a></li>)}</ul>:null}</aside></div>},
    {id:"specs",label:"SPECS",content:<div className="detail-tab-grid"><section className="content-panel"><span className="panel-kicker">TECHNICAL SHEET</span><h2>카메라 사양</h2><div className="spec-list">{[row("브랜드",brand.name),row("브랜드 국가",item.country),row("Camera Type",cameraTypeLabel[item.cameraType]),row("Film Format",item.filmFormat),row("Frame Format",item.frameFormat==="half-frame"?"Half Frame":"Full Frame"),row("ISO",item.iso||(item.cameraType==="single-use"?"미확인":"필름에 따라 다름")),row("Exposures",cameraExposures(item.exposures)),row("Film Type",filmTypeLabel[item.filmType]),row("Process",item.process),row("Flash",item.flash?"있음":"없음"),row("Waterproof",item.waterproof?item.waterproofDepth?`${item.waterproofDepth}m`:"있음 · 깊이 미확인":"없음"),row("Reloadable",item.reloadable?"가능":"불가")]}</div></section><section className="content-panel"><span className="panel-kicker">LENS & STOCK</span><h2>촬영과 내장 필름</h2><div className="spec-list">{[row("내장 필름",item.embeddedFilmName),row("Stock Status",stockLabel[item.stockStatus]),row("Standalone Film",availabilityLabel[item.standaloneFilmAvailability]),row("Lens",item.lens),row("Aperture",item.aperture),row("Shutter",item.shutter)]}</div></section></div>},
  ];
  return <div className="container page-shell cabinet-detail-page"><div className="detail-breadcrumb"><Link href="/cameras">Cameras</Link> / <Link href={`/brand/${brand.id}`}>{brand.name}</Link> / {item.name}</div>
    <section className="cabinet-detail-hero"><div><span className="detail-eyebrow">{countryFlag(brand.country)} {brand.name.toUpperCase()} · {cameraTypeLabel[item.cameraType].toUpperCase()}</span><h1>{item.name}</h1><div className="detail-tags"><span>{cameraIso(item.iso)}</span><span>{cameraExposures(item.exposures)}</span><span>{item.frameFormat==="half-frame"?"HALF FRAME":"FULL FRAME"}</span><span>{item.flash?"FLASH":"NO FLASH"}</span></div><p>{item.notes||`내장 필름과 촬영 조건을 확인해보세요.`}</p><DetailActions kind="cameras" id={item.id}/></div><div className="detail-art-holder"><CameraArt camera={item} large/></div></section>
    <DetailTabs items={tabs}/>
  </div>;
}
