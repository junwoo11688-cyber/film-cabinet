import { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata:Metadata={title:"35mm 필름 전체 목록",description:"브랜드, 국가, ISO, 현상 방식과 촬영 상황별로 35mm 필름을 탐색하세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">OPEN THE FILM DRAWER</span><h1>35mm Films</h1><p>현재 등록된 35mm 필름을 탐색하세요. 간단히 고르고, 궁금한 정보는 상세에서 더 살펴볼 수 있습니다.</p></div><Catalog kind="films"/></div>}
