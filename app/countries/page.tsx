import type { Metadata } from "next";
import Link from "next/link";
import { countries } from "@/data/countries";
import { brands } from "@/data/brands";
import { films } from "@/data/films";
export const metadata:Metadata={title:"국가별 브랜드",description:"미국, 일본, 영국, 오스트리아 등 국가별 35mm 필름 브랜드를 탐색하세요."};
export default function Page(){return <div className="container page-shell"><div className="detail-breadcrumb"><Link href="/films">Films</Link> / Countries</div><div className="page-heading"><span className="section-kicker">ATLAS / FILM BRANDS</span><h1>Countries</h1><p>브랜드의 소재지로 살펴봅니다. 실제 필름 제조국은 각 필름의 Origin 탭에서 확인하세요.</p></div><div className="country-grid">{countries.map(country=>{const list=brands.filter(x=>x.country===country.name);const total=films.filter(x=>list.some(brand=>brand.id===x.brandId)).length;return <section className="country-card" key={country.name}><div className="country-card-head"><span>{country.flag}</span><div><h2>{country.name}</h2><small>{total} Films · {list.length} Brands</small></div></div><div className="country-brand-list">{list.map(brand=><Link key={brand.id} href={`/brand/${brand.id}`}>{brand.name} ↗</Link>)}</div><Link href={`/films?country=${encodeURIComponent(country.name)}`} className="text-link">이 나라 필름 보기 ↗</Link></section>})}</div></div>}
