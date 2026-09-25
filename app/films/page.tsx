import { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata:Metadata={title:"35mm 필름 전체 목록",description:"브랜드, 국가, ISO, 현상 방식과 촬영 상황별로 35mm 필름을 탐색하세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">THE FILM LIBRARY</span><h1>35mm Films</h1><p>어떤 필름을 고를지 막막할 때, 색감과 빛의 조건부터 탐색해보세요. 브랜드 국가와 실제 제조 정보는 구분해 표시합니다.</p></div><Catalog kind="films"/></div>}
