import type { Metadata } from "next";
import Link from "next/link";
import { countries } from "@/data/countries";
import { brands } from "@/data/brands";
export const metadata:Metadata={title:"국가별 브랜드",description:"미국, 일본, 영국, 오스트리아 등 국가별 35mm 필름 브랜드를 탐색하세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">ATLAS / FILM BRANDS</span><h1>Countries</h1><p>여기서 국가는 브랜드의 소재지입니다. 실제 원판 제조국은 각 필름 상세 정보에서 별도로 확인하세요.</p></div><div className="category-grid">{countries.map(country=>{const list=brands.filter(x=>x.country===country.name);return <section className="category-card" key={country.name}><h2>{country.flag} {country.name} <small style={{fontSize:13,color:"#78899a"}}>{list.length}</small></h2><div className="brand-list">{list.map(brand=><Link key={brand.id} href={`/brand/${brand.id}`}><span>{brand.name}</span><small>{brand.group}</small></Link>)}</div><Link href={`/films?country=${encodeURIComponent(country.name)}`} className="text-link" style={{marginTop:14}}>해당 국가 필름 보기 ↗</Link></section>})}</div></div>}
