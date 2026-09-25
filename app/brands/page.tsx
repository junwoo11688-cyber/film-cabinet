import type { Metadata } from "next";
import Link from "next/link";
import { brands } from "@/data/brands";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
export const metadata:Metadata={title:"브랜드 아카이브",description:"실제 필름 제조사와 기획 브랜드, OEM·리스풀 브랜드의 차이를 살펴보세요."};
const groups=["실제 필름 제조사","흑백 전문","영화용 필름 기반","특수 컬러 / 실험","인디 / OEM / 리스풀","흑백 / 특수"];
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">THE BRAND DIRECTORY</span><h1>Brands</h1><p>브랜드가 있는 국가와 실제 필름 제조국은 다를 수 있습니다. 제조 관계가 공개되지 않은 제품은 원판을 추정하지 않습니다.</p></div><div className="category-grid">{groups.map(group=><section className="category-card" key={group}><h2>{group}</h2><div className="brand-list">{brands.filter(x=>x.group===group).map(brand=><Link key={brand.id} href={`/brand/${brand.id}`}><span>{brand.name}</span><small>{brand.country} · 필름 {films.filter(x=>x.brandId===brand.id).length} / 카메라 {cameras.filter(x=>x.brandId===brand.id).length}</small></Link>)}</div></section>)}</div></div>}
