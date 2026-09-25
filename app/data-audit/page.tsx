import type { Metadata } from "next";
import Link from "next/link";
import { films } from "@/data/films";
import { brands } from "@/data/brands";
import { cameras } from "@/data/cameras";
import { canonicalFilms } from "@/data/master-catalog";
import { catalogExpansions } from "@/data/catalog-expansion";
import { auditCatalog } from "@/lib/catalog-audit";

export const metadata: Metadata = {title:"Data Audit | FILM INDEX",robots:{index:false,follow:false}};
const report = auditCatalog(films,brands,cameras,canonicalFilms);
const metrics = [
  ["Registered Films",report.registeredFilms],["Canonical Films",report.canonicalFilms],["Missing",report.missing.length],
  ["Duplicates",report.duplicates.length],["Unknown Stock",report.unknownStock.length],["Unknown Availability",report.unknownAvailability.length],
  ["Regional Films",report.regional.length],["Out of Stock",report.outOfStock.length],["Legacy",report.legacy.length],["Discontinued",report.discontinued.length],
];
const groups = [
  {title:"Missing",items:report.missing.map(item=>({id:item.id,name:`${item.brandId} ${item.name}`}))},
  {title:"Issues",items:report.issues.map(item=>({id:item.filmId,name:item.detail}))},
  {title:"Newly Discovered",items:catalogExpansions.filter(item=>item.newlyDiscovered).map(item=>({id:item.id,name:`${item.brandId} ${item.name}`}))},
  {title:"Unknown Stock",items:report.unknownStock.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Unknown Availability",items:report.unknownAvailability.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Regional Films",items:report.regional.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name} · ${item.marketRegions?.join(", ")||"지역 미상"}`}))},
  {title:"Out of Stock",items:report.outOfStock.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Legacy",items:report.legacy.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
  {title:"Discontinued",items:report.discontinued.map(item=>({id:item.id,name:`${brands.find(brand=>brand.id===item.brandId)?.name} ${item.name}`}))},
];
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">INTERNAL / DATA QUALITY</span><h1>Data Audit</h1><p>실제 Film 객체와 독립 마스터 목록을 비교한 결과입니다. 판매 정보는 2026-09-25에 확인한 출처와 함께 기록했습니다.</p></div><div className="audit-metrics">{metrics.map(([label,value])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="audit-sections">{groups.map(group=><section className="content-panel" key={group.title}><h2>{group.title} <small>{group.items.length}</small></h2>{group.items.length?<div className="audit-list">{group.items.map((item,index)=>item.id&&films.some(film=>film.id===item.id)?<Link key={`${item.id}-${index}`} href={`/film/${item.id}`}>{item.name} <span>↗</span></Link>:<span key={`${item.name}-${index}`}>{item.name}</span>)}</div>:<p>없음</p>}</section>)}</div></div>}
