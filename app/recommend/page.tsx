import type { Metadata } from "next";
import { RecommendView } from "@/components/recommend-view";

export const metadata:Metadata={title:"오늘 뭐 넣지?",description:"촬영 장면, 빛, 원하는 룩을 기준으로 현재 구매 가능한 135 필름 후보를 골라보세요."};

export default function Page(){return <div className="container page-shell recommend-page"><div className="page-heading"><span className="section-kicker">TODAY&apos;S FILM</span><h1>오늘 뭐 넣지?</h1><p>세 가지 질문에 답하면 문서화된 필름 특성과 기술 사양으로 후보를 고릅니다. 절대적인 순위가 아니라 오늘의 조건에 맞춘 발견입니다.</p></div><RecommendView/></div>}
