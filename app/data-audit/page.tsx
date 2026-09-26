import type { Metadata } from "next";
import Link from "next/link";
import { films } from "@/data/films";
import { brands } from "@/data/brands";
import { cameras } from "@/data/cameras";
import { canonicalFilms } from "@/data/master-catalog";
import { catalogExpansions } from "@/data/catalog-expansion";
import { archiveExpansions } from "@/data/archive-expansion";
import { auditCatalog } from "@/lib/catalog-audit";

export const metadata: Metadata = {title:"Data Audit",robots:{index:false,follow:false}};
const report = auditCatalog(films,brands,cameras,canonicalFilms);
const metrics = [
  ["TOTAL FILMS",report.registeredFilms],["STILL",report.still.length],["MOTION",report.motion.length],["EFFECT",report.effect.length],
  ["INDUSTRIAL",report.industrial.length],["LIMITED",report.limited.length],["COMING SOON",report.comingSoon.length],
  ["UNKNOWN STOCK",report.unknownStock.length],["MISSING SOURCES",report.missingSources.length],["DUPLICATES",report.duplicates.length],
];
const practicalCoverage = [
  ["Practical profiles",report.practicalCoverage.profile.length],["Grain known",report.practicalCoverage.grain.length],["Contrast known",report.practicalCoverage.contrast.length],
  ["Saturation known",report.practicalCoverage.saturation.length],["Latitude known",report.practicalCoverage.latitude.length],["Recommended uses",report.practicalCoverage.recommendedUses.length],
] as const;
const technicalCoverage = [
  ["DX known",report.technicalCoverage.dx.length],["Exposure count",report.technicalCoverage.exposures.length],["Color balance",report.technicalCoverage.colorBalance.length],
  ["Rem-jet known",report.technicalCoverage.remjet.length],["Push / Pull known",report.technicalCoverage.pushPull.length],["IR / Ortho known",report.technicalCoverage.irOrtho.length],
] as const;
const groups = [
  {title:"Missing",items:report.missing.map(item=>({id:item.id,name:`${item.brandId} ${item.name}`}))},
  {title:"Missing Sources",items:report.missingSources.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Issues",items:report.issues.map(item=>({id:item.filmId,name:item.detail}))},
  {title:"Newly Discovered",items:catalogExpansions.filter(item=>item.newlyDiscovered).map(item=>({id:item.id,name:`${item.brandId} ${item.name}`}))},
  {title:"Archive Expansion",items:archiveExpansions.map(item=>({id:item.id,name:`${item.brandId} ${item.name}`}))},
  {title:"Unknown Stock",items:report.unknownStock.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Unknown Availability",items:report.unknownAvailability.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Regional Films",items:report.regional.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name} · ${item.marketRegions?.join(", ")||"지역 미상"}`}))},
  {title:"Out of Stock",items:report.outOfStock.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Legacy",items:report.legacy.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Discontinued",items:report.discontinued.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
];
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">INTERNAL / DATA QUALITY</span><h1>Data Audit</h1><p>실제 Film 객체와 독립 마스터 목록을 비교한 결과입니다. 신규 카탈로그 판매 정보는 2026-09-26에 확인한 출처와 함께 기록했습니다.</p></div><div className="audit-metrics">{metrics.map(([label,value])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="coverage-sections"><Coverage title="PRACTICAL PROFILE COVERAGE" items={practicalCoverage} total={report.registeredFilms}/><Coverage title="TECHNICAL COVERAGE" items={technicalCoverage} total={report.registeredFilms}/></div><div className="audit-sections">{groups.map(group=><section className="content-panel" key={group.title}><h2>{group.title} <small>{group.items.length}</small></h2>{group.items.length?<div className="audit-list">{group.items.map((item,index)=>item.id&&films.some(film=>film.id===item.id)?<Link key={`${item.id}-${index}`} href={`/film/${item.id}`}>{item.name} <span>↗</span></Link>:<span key={`${item.name}-${index}`}>{item.name}</span>)}</div>:<p>없음</p>}</section>)}</div></div>}

function Coverage({title,items,total}:{title:string;items:ReadonlyArray<readonly [string,number]>;total:number}){return <section className="content-panel coverage-panel"><span className="panel-kicker">{title}</span><div className="coverage-list">{items.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong><small>{total-value} unknown</small></div>)}</div></section>}
