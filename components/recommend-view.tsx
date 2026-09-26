"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, GitCompareArrows, Heart, Shuffle } from "lucide-react";
import { films } from "@/data/films";
import { brandById } from "@/data/brands";
import type { Film } from "@/data/types";
import { FilmArt } from "./cards";
import { useStore } from "./store";
import { filmAvailabilityLabel } from "@/lib/format";
import { LightChoice, lightChoiceLabel, LookChoice, lookLabel, RecommendationCriteria, recommendFilms, ShootingChoice, surpriseFilmPool, useLabel } from "@/lib/recommend-films";

const shootingOptions:ObjectEntries<ShootingChoice>=[["portrait","인물"],["street","거리"],["landscape","풍경"],["travel","여행"],["indoor","실내"],["night","밤"],["experimental","실험"],["any","아무거나"]];
const lightOptions:ObjectEntries<LightChoice>=[["bright-daylight","밝은 낮"],["overcast","흐림"],["indoor","실내"],["night","야간"],["tungsten","텅스텐 / 전구빛"],["any","잘 모르겠음"]];
const lookOptions:ObjectEntries<LookChoice>=[["natural","자연스럽게"],["vivid","선명하고 컬러풀하게"],["soft","부드럽게"],["vintage","빈티지하게"],["cinema","시네마 느낌"],["experimental","실험적으로"],["bw","흑백"]];
type ObjectEntries<T extends string> = Array<readonly [T,string]>;

export function RecommendView(){
  const router=useRouter();
  const {favorites,compare,toggleFavorite,toggleCompare,setCompare}=useStore();
  const [step,setStep]=useState(0);
  const [shooting,setShooting]=useState<ShootingChoice>();
  const [light,setLight]=useState<LightChoice>();
  const [look,setLook]=useState<LookChoice>();
  const [surprise,setSurprise]=useState<Film>();
  const criteria=shooting&&light&&look?{shooting,light,look} satisfies RecommendationCriteria:undefined;
  const picks=useMemo(()=>shooting&&light&&look?recommendFilms(films,{shooting,light,look}):[],[shooting,light,look]);
  const displayed=surprise?[{film:surprise,score:0,reasons:[`현재 구매 가능한 ${surprise.packagingType==="135-cartridge"?"135 카트리지":"필름"}입니다.`,`ISO ${surprise.iso} · ${surprise.process} 사양을 기준으로 무작위 선택했습니다.`]}]:picks;

  const chooseShooting=(value:ShootingChoice)=>{setShooting(value);setSurprise(undefined);setStep(1);};
  const chooseLight=(value:LightChoice)=>{setLight(value);setSurprise(undefined);setStep(2);};
  const chooseLook=(value:LookChoice)=>{setLook(value);setSurprise(undefined);setStep(3);};
  const reset=()=>{setStep(0);setShooting(undefined);setLight(undefined);setLook(undefined);setSurprise(undefined);};
  const surpriseMe=()=>{
    const pool=surpriseFilmPool(films);if(!pool.length)return;
    const key="film-cabinet-surprise-history";
    let used:string[]=[];try{used=JSON.parse(sessionStorage.getItem(key)||"[]");}catch{/* ignore invalid session value */}
    let available=pool.filter(film=>!used.includes(film.id));if(!available.length){used=[];available=pool;}
    const film=available[Math.floor(Math.random()*available.length)];
    setSurprise(film);setStep(3);sessionStorage.setItem(key,JSON.stringify([...used,film.id].slice(-Math.min(pool.length,20))));
  };
  const comparePicks=()=>{const ids=displayed.map(item=>item.film.id).slice(0,4);setCompare("films",ids);router.push("/compare");};

  return <div className="recommend-flow">
    {step<3&&<section className="recommend-question" aria-live="polite"><div className="recommend-progress"><span>0{step+1}</span><div><i style={{width:`${((step+1)/3)*100}%`}}/></div><small>03</small></div>{step===0&&<Question kicker="STEP 1" title="WHAT ARE YOU SHOOTING?" help="오늘 담으려는 장면을 하나 골라주세요." options={shootingOptions} selected={shooting} onSelect={chooseShooting}/>} {step===1&&<Question kicker="STEP 2" title="LIGHT" help="가장 가까운 빛 조건을 골라주세요." options={lightOptions} selected={light} onSelect={chooseLight}/>} {step===2&&<Question kicker="STEP 3" title="LOOK" help="원하는 결과의 방향을 골라주세요." options={lookOptions} selected={look} onSelect={chooseLook}/>}<div className="recommend-nav">{step>0?<button type="button" onClick={()=>setStep(step-1)}><ArrowLeft size={16}/> 이전</button>:<span/>}<button type="button" className="surprise-button" onClick={surpriseMe}><Shuffle size={16}/> SURPRISE ME</button></div></section>}
    {step===3&&<section className="recommend-results" aria-live="polite"><div className="recommend-results-head"><div><span className="section-kicker">TODAY&apos;S FILM = DISCOVERY</span><h1>{surprise?"오늘의 깜짝 한 롤":"오늘의 필름 후보"}</h1>{criteria&&!surprise&&<p>{useLabel[criteria.shooting]} · {lightChoiceLabel[criteria.light]} · {lookLabel[criteria.look]} 조건을 데이터로 비교했습니다.</p>}</div><div><button type="button" onClick={reset}><ArrowLeft size={16}/> 다시 고르기</button><button type="button" onClick={surpriseMe}><Shuffle size={16}/> SURPRISE ME</button></div></div>{displayed.length?<div className={`recommend-picks ${displayed.length===1?"single":""}`}>{displayed.map(({film,reasons},index)=><RecommendationCard key={film.id} film={film} rank={index+1} reasons={reasons.length?reasons:["선택 조건과 등록된 필름 사양이 일치합니다."]} liked={favorites.films.includes(film.id)} compared={compare.films.includes(film.id)} onFavorite={()=>toggleFavorite("films",film.id)} onCompare={()=>toggleCompare("films",film.id)}/>)}</div>:<div className="empty-state"><h3>이 조건에 맞는 판매 중 135 필름이 없습니다.</h3><p>빛 조건이나 룩을 조금 넓혀 다시 골라보세요.</p><button type="button" onClick={reset}>다시 고르기</button></div>}{displayed.length>1&&<button type="button" className="compare-picks-button" onClick={comparePicks}><GitCompareArrows size={18}/> COMPARE THESE FILMS <ArrowRight size={17}/></button>}</section>}
  </div>;
}

function Question<T extends string>({kicker,title,help,options,selected,onSelect}:{kicker:string;title:string;help:string;options:ObjectEntries<T>;selected?:T;onSelect:(value:T)=>void}){return <div><span className="panel-kicker">{kicker}</span><h1>{title}</h1><p>{help}</p><div className="recommend-options">{options.map(([value,label])=><button type="button" key={value} className={selected===value?"active":""} aria-pressed={selected===value} onClick={()=>onSelect(value)}>{selected===value&&<Check size={17}/>}<span>{label}</span></button>)}</div></div>}

function RecommendationCard({film,rank,reasons,liked,compared,onFavorite,onCompare}:{film:Film;rank:number;reasons:string[];liked:boolean;compared:boolean;onFavorite:()=>void;onCompare:()=>void}){const brand=brandById[film.brandId];return <article className="recommend-card"><div className="recommend-rank">0{rank}</div><FilmArt film={film}/><div className="recommend-card-body"><span>{brand.name.toUpperCase()}</span><h2>{film.name}</h2><div className="recommend-facts"><b>ISO {film.iso}</b><b>{film.process}</b><b>{filmAvailabilityLabel[film.availabilityStatus]}</b></div><div className="recommend-why"><small>WHY IT FITS</small>{reasons.map(reason=><p key={reason}>{reason}</p>)}</div><div className="recommend-actions"><Link href={`/film/${film.id}`}>DETAIL <ArrowRight size={15}/></Link><button type="button" className={compared?"selected":""} onClick={onCompare}><GitCompareArrows size={16}/>{compared?"IN COMPARE":"COMPARE"}</button><button type="button" className={liked?"selected":""} onClick={onFavorite}><Heart size={16} fill={liked?"currentColor":"none"}/>{liked?"SAVED":"SAVE TO CABINET"}</button></div></div></article>}
