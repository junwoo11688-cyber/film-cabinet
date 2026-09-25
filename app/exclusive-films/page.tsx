import type { Metadata } from "next";
import Link from "next/link";
import { cameraById } from "@/data/cameras";
import { filmById } from "@/data/films";
import { brandById } from "@/data/brands";
import { filmTypeShort } from "@/lib/format";
import { exclusiveEntries, ExclusiveEntry } from "@/data/exclusive";

export const metadata:Metadata={title:"카메라 안에서만 만날 수 있는 필름",description:"일반 35mm 롤로 별도 구매하기 어렵거나 정확한 원판이 공개되지 않은 일회용 카메라 내장 필름 아카이브."};
const badge={exclusive:"CAMERA EXCLUSIVE",unknown:"STOCK UNKNOWN",available:"AVAILABLE AS ROLL"};
function Section({kind,title,description}:{kind:ExclusiveEntry["kind"];title:string;description:string}){
  return <section className="exclusive-section"><h2>{title}</h2><p>{description}</p><div className="exclusive-grid">{exclusiveEntries.filter(x=>x.kind===kind).map(entry=>{const first=cameraById[entry.cameraIds[0]];const film=entry.linkedFilmId?filmById[entry.linkedFilmId]:undefined;return <article className="exclusive-card" key={entry.name}><span className="brand">{brandById[entry.brandId].name.toUpperCase()}</span><h3>{entry.name}</h3><span className={`stock-badge ${kind}`}>{badge[kind]}</span><div className="tag-row"><span>ISO {first.iso}</span><span>{filmTypeShort[first.filmType]}</span><span>{first.process}</span></div><p>{entry.description}</p><div className="exclusive-meta"><b>탑재 카메라</b><br/>{entry.cameraIds.map(id=>cameraById[id]?.name).join(" · ")}<br/><b>별도 롤</b><br/>{kind==="exclusive"?"동일 제품 미판매":kind==="unknown"?"확인되지 않음":"구매 가능"}<br/><b>원판</b><br/>{kind==="unknown"?"공개되지 않음":film?.stockOrigin||"정확한 원판 정보 제한"}</div><div className="exclusive-actions"><Link href={`/camera/${first.id}`}>카메라 보기 ↗</Link><Link href={`/exclusive-films/${entry.id}`}>자세히 보기 ↗</Link></div></article>})}</div></section>;
}
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">HIDDEN INSIDE / THE SPECIAL ARCHIVE</span><h1>카메라 안에서만 만날 수 있는 필름</h1><p>일반 35mm 롤로 따로 판매되지 않거나, 정확한 원판이 공개되지 않은 일회용 카메라 내장 필름을 모았습니다. 같은 ISO라고 해서 같은 필름으로 취급하지 않습니다.</p></div><div className="guide-note" style={{marginTop:0}}>CAMERA EXCLUSIVE는 동일한 일반 롤 제품을 확인할 수 없는 경우, STOCK UNKNOWN은 정확한 원판을 알 수 없는 경우입니다. 판매 현황은 지역과 시기에 따라 바뀔 수 있습니다.</div><Section kind="exclusive" title="A. Camera Exclusive" description="이 필름은 일반 롤로 동일 제품을 구매할 수 없는 것으로 분류했습니다. 해당 카메라에서만 경험할 수 있습니다."/><Section kind="unknown" title="B. Unknown Stock" description="카메라에 들어 있지만 정확한 원판 정보는 공개되지 않았습니다."/><Section kind="available" title="C. Same Film Available Separately" description="일회용 카메라와 일반 35mm 롤에서 같은 필름을 만나볼 수 있습니다."/></div>}
