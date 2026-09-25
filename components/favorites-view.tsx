"use client";

import Link from "next/link";
import { useState } from "react";
import { filmById } from "@/data/films";
import { cameraById } from "@/data/cameras";
import { FilmCard, CameraCard } from "./cards";
import { useStore } from "./store";

export function FavoritesView(){const [kind,setKind]=useState<"films"|"cameras">("films");const {favorites}=useStore();const ids=favorites[kind];return <><div className="tabs"><button className={kind==="films"?"active":""} onClick={()=>setKind("films")}>Films ({favorites.films.length})</button><button className={kind==="cameras"?"active":""} onClick={()=>setKind("cameras")}>Cameras ({favorites.cameras.length})</button></div>{ids.length?<div className="card-grid">{kind==="films"?ids.filter(id=>filmById[id]).map(id=><FilmCard key={id} film={filmById[id]}/>):ids.filter(id=>cameraById[id]).map(id=><CameraCard key={id} camera={cameraById[id]}/>)}</div>:<div className="empty-state"><div className="empty-heart">♡</div><h3>아직 캐비닛에 넣어둔 {kind==="films"?"필름이":"카메라가"} 없습니다.</h3><p>마음에 드는 카드의 하트를 눌러 모아보세요. 이 브라우저에 저장됩니다.</p><Link href={kind==="films"?"/films":"/cameras"}>목록 둘러보기</Link></div>}</>}
