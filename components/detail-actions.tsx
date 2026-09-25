"use client";

import Link from "next/link";
import { Heart, GitCompareArrows } from "lucide-react";
import { useStore } from "./store";

export function DetailActions({kind,id}:{kind:"films"|"cameras";id:string}){
  const {favorites,compare,toggleFavorite,toggleCompare}=useStore();const liked=favorites[kind].includes(id),selected=compare[kind].includes(id);
  return <div className="detail-actions"><button className="primary-button" onClick={()=>toggleFavorite(kind,id)}><Heart size={17} fill={liked?"currentColor":"none"}/>{liked?"즐겨찾기 해제":"즐겨찾기"}</button><button className="outline-button" disabled={!selected&&compare[kind].length>=4} title={!selected&&compare[kind].length>=4?"최대 4개까지 비교 가능":undefined} onClick={()=>toggleCompare(kind,id)}><GitCompareArrows size={17}/>{selected?"비교에서 빼기":"비교에 추가"}</button><Link className="outline-button" href="/compare">비교 보기</Link></div>;
}
