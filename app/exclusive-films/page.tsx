import type { Metadata } from "next";
import Link from "next/link";
import { ExclusiveView } from "@/components/exclusive-view";

export const metadata:Metadata={title:"카메라 안에서만 만나는 필름",description:"일반 롤로 별도 구매할 수 없거나 정확한 원판이 공개되지 않은 카메라 내장 필름을 탐색하세요."};
export default function Page(){return <div className="container page-shell"><div className="detail-breadcrumb"><Link href="/discover">Discover</Link> / Camera Exclusive</div><div className="page-heading"><span className="section-kicker">THE HIDDEN DRAWER</span><h1>카메라 안에서만 만나는 필름</h1><p>일반 롤로는 따로 살 수 없거나, 정확한 원판이 공개되지 않은 일회용 카메라 내장 필름.</p></div><ExclusiveView/></div>}
