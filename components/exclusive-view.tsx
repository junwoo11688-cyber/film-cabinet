"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { exclusiveEntries, type ExclusiveEntry } from "@/data/exclusive";
import { cameraById } from "@/data/cameras";
import { filmById } from "@/data/films";
import { brandById } from "@/data/brands";
import { filmTypeShort } from "@/lib/format";

type Kind=ExclusiveEntry["kind"];
const options:{id:Kind;label:string;hint:string}[]=[
  {id:"exclusive",label:"CAMERA EXCLUSIVE",hint:"일반 롤 없음"},
  {id:"unknown",label:"STOCK UNKNOWN",hint:"정확한 원판 비공개"},
  {id:"available",label:"AVAILABLE AS ROLL",hint:"같은 필름 구매 가능"},
];
export function ExclusiveView(){
  const [kind,setKind]=useState<Kind>("exclusive");
  const list=exclusiveEntries.filter(x=>x.kind===kind);
  return <><div className="exclusive-filter" role="tablist" aria-label="내장 필름 분류">{options.map(option=><button key={option.id} role="tab" aria-selected={kind===option.id} className={kind===option.id?"active":""} onClick={()=>setKind(option.id)}><strong>{option.label}</strong><small>{option.hint}</small></button>)}</div>
    <p className="exclusive-context">{kind==="exclusive"?"동일한 35mm 일반 롤 제품이 확인되지 않은 내장 필름입니다.":kind==="unknown"?"내장 필름의 정확한 원판이 공개되지 않았습니다. 같은 ISO만으로 제품을 연결하지 않습니다.":"일회용 카메라에 들어가지만 일반 35mm 롤로도 살 수 있는 필름입니다."}</p>
    <div className="exclusive-grid">{list.map(entry=>{const first=cameraById[entry.cameraIds[0]];const film=entry.linkedFilmId?filmById[entry.linkedFilmId]:undefined;return <article className={`exclusive-card exclusive-${kind}`} key={entry.id}><div className="exclusive-card-top"><span className={`stock-badge ${kind}`}>{options.find(x=>x.id===kind)?.label}</span><span>{brandById[entry.brandId].name.toUpperCase()}</span></div><h2>{entry.name}</h2><div className="exclusive-facts"><span>ISO {first.iso||"미확인"}</span><span>{filmTypeShort[first.filmType]}</span><span>{first.process}</span></div><p>{entry.description}</p><div className="exclusive-meta"><div><small>AVAILABLE IN</small><strong>{entry.cameraIds.map(id=>cameraById[id]?.name).join(" · ")}</strong></div><div><small>STANDALONE ROLL</small><strong>{kind==="exclusive"?"동일 제품 미판매":kind==="unknown"?"확인 필요":"구매 가능"}</strong></div><div><small>STOCK ORIGIN</small><strong>{film?.stockOrigin||"공개되지 않음"}</strong></div></div><div className="exclusive-actions"><Link href={`/exclusive-films/${entry.id}`}>자세히 보기 <ArrowUpRight size={16}/></Link><Link href={`/camera/${first.id}`}>카메라 보기 <ArrowUpRight size={16}/></Link></div></article>})}</div></>;
}
