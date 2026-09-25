import { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata:Metadata={title:"일회용 카메라 아카이브",description:"일회용 카메라와 재장전 가능한 프리로드 카메라의 내장 필름, 플래시, 방수 정보를 비교하세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">THE CAMERA ARCHIVE</span><h1>Single Use Cameras</h1><p>일회용 카메라와 재장전 가능한 카메라를 구분했습니다. 안에 들어 있는 필름이 일반 롤로도 판매되는지 확인해보세요.</p></div><Catalog kind="cameras"/></div>}
