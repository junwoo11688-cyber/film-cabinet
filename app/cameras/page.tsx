import { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata:Metadata={title:"일회용 카메라 아카이브",description:"일회용 카메라와 재장전 가능한 프리로드 카메라의 내장 필름, 플래시, 방수 정보를 비교하세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">THE CAMERA DRAWER</span><h1>Cameras</h1><p>필름이 들어 있는 일회용 카메라부터 재장전 가능한 카메라까지. 안에 든 필름도 함께 확인하세요.</p></div><Catalog kind="cameras"/></div>}
