import type { Metadata } from "next";
import { CompareView } from "@/components/compare-view";
export const metadata:Metadata={title:"필름·카메라 비교",description:"최대 4개 필름 또는 카메라의 ISO, 현상, 원판, 특성을 나란히 비교하세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">SIDE BY SIDE</span><h1>Compare</h1><p>필름과 카메라를 각각 최대 4개까지 나란히 볼 수 있습니다.</p></div><CompareView/></div>}
