import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Aperture, Clapperboard, Droplets, Eclipse, FlaskConical, Globe2, Moon, Sparkles, WandSparkles } from "lucide-react";

export const metadata:Metadata={title:"Discover",description:"촬영 상황과 필름의 성격을 따라 35mm 필름과 카메라를 탐험하세요."};
const collections=[
  {tag:"01 / HIDDEN",title:"Camera Exclusive",text:"일회용 카메라 안에서만 만나는 필름과 정확한 원판이 공개되지 않은 재고.",href:"/exclusive-films",icon:Sparkles,accent:"amber"},
  {tag:"02 / MOTION",title:"Cinema Stocks",text:"영화용 원판에서 시작한 필름. 색온도와 현상 방식까지 살펴보세요.",href:"/films?type=시네마%20필름",icon:Clapperboard,accent:"blue"},
  {tag:"03 / NEW",title:"New Emulsions",text:"최근 새롭게 등장한 컬러 유제와 2025–2026 신제품.",href:"/films?collection=2025–2026%20신제품",icon:WandSparkles,accent:"rose"},
  {tag:"04 / ATLAS",title:"Regional Films",text:"일본, 한국, 중국 등 특정 지역의 카탈로그에서 만나는 필름.",href:"/films?sale=지역%20한정",icon:Globe2,accent:"sage"},
  {tag:"05 / PLAY",title:"Experimental Color",text:"Purple, Turquoise, Redscale. 예상 밖의 색을 꺼내보세요.",href:"/films?type=특수%20컬러",icon:FlaskConical,accent:"violet"},
  {tag:"06 / CLASSIC",title:"Black & White",text:"빛과 그림자에 집중하는 클래식부터 현대 흑백까지.",href:"/films?type=흑백%20네거티브",icon:Eclipse,accent:"slate"},
  {tag:"07 / AFTER DARK",title:"Night Films",text:"높은 ISO, Tungsten, Neon. 어두운 거리에서 고르는 한 롤.",href:"/films?for=야경",icon:Moon,accent:"blue"},
  {tag:"08 / REVERSAL",title:"Slide Films",text:"투명한 필름 위에 직접 남는 E-6 컬러 리버설.",href:"/films?type=슬라이드",icon:Aperture,accent:"amber"},
  {tag:"09 / MEMORY",title:"Discontinued Legends",text:"단종됐어도 지우지 않고 기록으로 남기는 필름.",href:"/films?sale=단종",icon:Droplets,accent:"rose"},
];
const situations=[
  ["첫 필름","/films?for=첫%20필름"],["인물","/films?for=인물"],["여행","/films?for=여행"],["풍경","/films?for=풍경"],["스트리트","/films?for=스트리트"],["실내","/films?for=실내"],["네온","/films?for=네온"],["방수 카메라","/cameras?waterproof=있음"],
];
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">CURATED DRAWERS</span><h1>Discover</h1><p>평범한 검색 대신, 촬영 상황과 필름의 성격으로 골라보세요.</p></div><div className="curation-grid">{collections.map(x=><Link href={x.href} className={`curation-card accent-${x.accent}`} key={x.title}><div className="curation-top"><span>{x.tag}</span><x.icon size={27} strokeWidth={1.6}/></div><div><h2>{x.title}</h2><p>{x.text}</p></div><span className="curation-arrow">컬렉션 열기 <ArrowUpRight size={18}/></span></Link>)}</div><section className="situation-strip"><h2>장면으로 더 찾아보기</h2><div>{situations.map(([label,href])=><Link key={label} href={href}>{label} ↗</Link>)}</div></section></div>}
