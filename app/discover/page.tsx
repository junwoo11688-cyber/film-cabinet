import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Aperture, Clapperboard, Droplets, Eclipse, FlaskConical, Globe2, Moon, Sparkles, WandSparkles } from "lucide-react";

export const metadata:Metadata={title:"Discover",description:"촬영 상황과 필름의 성격을 따라 35mm 필름과 카메라를 탐험하세요."};
const collections=[
  {tag:"01 / HIDDEN",title:"Camera Exclusive",text:"일회용 카메라 안에서만 만나는 필름과 정확한 원판이 공개되지 않은 재고.",href:"/exclusive-films",icon:Sparkles,accent:"amber"},
  {tag:"02 / NEW",title:"New Emulsions",text:"Kodak VERITA 200D와 KONO! 2026 제품처럼 새롭게 등장한 필름.",href:"/films?q=2026",icon:WandSparkles,accent:"rose"},
  {tag:"03 / MAKERS",title:"Film Manufacturers",text:"Kodak, HARMAN, FOMA, ADOX, Ferrania, ORWO 등 실제 감광재 제조 생태계.",href:"/brands",icon:Globe2,accent:"sage"},
  {tag:"04 / MOTION",title:"Motion Picture Stocks",text:"VISION3, VERITA, Double-X, ORWO처럼 카트리지가 아닌 원본 35mm 영화용 벌크 재고.",href:"/films?photographyUse=Motion%20Picture",icon:Clapperboard,accent:"blue"},
  {tag:"05 / EFFECT",title:"Effect Films",text:"revolog, KONO!, dubblefilm의 프리-익스포즈드·컬러 틴트·특수 효과 필름.",href:"/films?category=Effect",icon:FlaskConical,accent:"violet"},
  {tag:"06 / WEIRD",title:"Industrial & Weird",text:"FPP와 ORWO의 저감도·복제·보존·산업용 특수 재고.",href:"/films?photographyUse=Industrial%20%2F%20Special",icon:Droplets,accent:"slate"},
  {tag:"07 / SOON",title:"Coming Soon",text:"공식 개발 중이지만 아직 판매 카운트에 포함하지 않는 필름.",href:"/films?sale=개발%20중",icon:Sparkles,accent:"amber"},
  {tag:"08 / CLASSIC",title:"Black & White",text:"빛과 그림자에 집중하는 클래식부터 현대 흑백까지.",href:"/films?type=흑백%20네거티브",icon:Eclipse,accent:"slate"},
  {tag:"09 / AFTER DARK",title:"Night Films",text:"높은 ISO, Tungsten, Neon. 어두운 거리에서 고르는 한 롤.",href:"/films?for=야경",icon:Moon,accent:"blue"},
  {tag:"10 / REVERSAL",title:"Slide Films",text:"투명한 필름 위에 직접 남는 E-6와 흑백 리버설.",href:"/films?type=슬라이드",icon:Aperture,accent:"amber"},
];
const situations=[
  ["첫 필름","/films?for=첫%20필름"],["인물","/films?for=인물"],["여행","/films?for=여행"],["풍경","/films?for=풍경"],["스트리트","/films?for=스트리트"],["실내","/films?for=실내"],["네온","/films?for=네온"],["방수 카메라","/cameras?waterproof=있음"],
];
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">CURATED DRAWERS</span><h1>Discover</h1><p>평범한 검색 대신, 촬영 상황과 필름의 성격으로 골라보세요.</p></div><div className="curation-grid">{collections.map(x=><Link href={x.href} className={`curation-card accent-${x.accent}`} key={x.title}><div className="curation-top"><span>{x.tag}</span><x.icon size={27} strokeWidth={1.6}/></div><div><h2>{x.title}</h2><p>{x.text}</p></div><span className="curation-arrow">컬렉션 열기 <ArrowUpRight size={18}/></span></Link>)}</div><section className="situation-strip"><h2>장면으로 더 찾아보기</h2><div>{situations.map(([label,href])=><Link key={label} href={href}>{label} ↗</Link>)}</div></section></div>}
