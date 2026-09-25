import type { Metadata } from "next";
import Link from "next/link";
export const metadata:Metadata={title:"촬영 상황별 필름 찾기",description:"인물, 풍경, 여행, 야경, 흑백, 첫 필름 등 촬영 상황에 맞는 35mm 필름을 찾아보세요."};
const choices=[
  {icon:"◒",title:"인물",text:"피부 톤이 자연스러운 필름",href:"/films?for=인물"},{icon:"☼",title:"맑은 날",text:"햇빛 아래에서 빛나는 컬러",href:"/films?for=맑은%20날"},{icon:"▧",title:"풍경",text:"넓은 장면과 색의 결",href:"/films?for=풍경"},{icon:"✈",title:"여행",text:"가볍게 챙기는 한 롤",href:"/films?for=여행"},
  {icon:"▥",title:"스트리트",text:"도시의 우연한 순간",href:"/films?for=스트리트"},{icon:"☾",title:"야경",text:"어두운 거리의 빛",href:"/films?for=야경"},{icon:"⌂",title:"실내",text:"창가와 실내의 장면",href:"/films?for=실내"},{icon:"✳",title:"특수 색감",text:"예상 밖의 팔레트",href:"/films?for=특수%20색감"},
  {icon:"◐",title:"흑백",text:"빛과 그림자에 집중",href:"/films?for=흑백"},{icon:"▣",title:"영화 같은 느낌",text:"시네마 톤과 네온",href:"/films?for=영화%20같은%20느낌"},{icon:"◈",title:"빈티지",text:"시간이 묻어나는 컬러",href:"/films?for=빈티지"},{icon:"◎",title:"첫 필름",text:"입문하기 편한 필름",href:"/films?for=첫%20필름"},
  {icon:"▤",title:"첫 일회용 카메라",text:"간단한 27컷의 시작",href:"/cameras?type=Single%20Use"},{icon:"≋",title:"방수 카메라",text:"물가에서도 한 장",href:"/cameras?waterproof=있음"},
  {icon:"✦",title:"네온",text:"도시의 밤과 인공조명",href:"/films?for=네온"},{icon:"▣",title:"슬라이드",text:"투명 필름 위에 남는 색",href:"/films?type=슬라이드"},
  {icon:"●",title:"현재 구매 가능한 필름",text:"재고·소매·예약·지역 판매",href:"/films?sale=현재%20구매%20가능"},{icon:"✧",title:"2025–2026 신제품",text:"새로 등장한 35mm 제품",href:"/films?collection=2025–2026%20신제품"},
  {icon:"◎",title:"지역 한정",text:"시장별로 다른 필름 라인업",href:"/films?sale=지역%20한정"},{icon:"◉",title:"새로운 자체 컬러 유제",text:"HARMAN의 새로운 컬러 실험",href:"/films?collection=새로운%20자체%20컬러%20유제"},
  {icon:"▤",title:"시네마 필름 기반",text:"영화용 원판에서 출발한 제품",href:"/films?type=시네마%20필름"},{icon:"◈",title:"일회용에서만 만날 수 있는 필름",text:"카메라 안의 숨겨진 한 롤",href:"/exclusive-films"},
];
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">FIND YOUR FRAME</span><h1>Discover</h1><p>장면을 먼저 고르면 어울리는 필름과 카메라가 보입니다.</p></div><div className="discover-grid">{choices.map(x=><article className="discover-card" key={x.title}><span className="discover-icon">{x.icon}</span><h2>{x.title}</h2><p>{x.text}</p><Link href={x.href}>탐색하기 ↗</Link></article>)}</div></div>}
