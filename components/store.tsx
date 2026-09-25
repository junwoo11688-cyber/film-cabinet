"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { brandById } from "@/data/brands";

type Kind = "films" | "cameras";
type Store = {
  favorites: Record<Kind,string[]>;
  compare: Record<Kind,string[]>;
  toggleFavorite: (kind:Kind,id:string)=>void;
  toggleCompare: (kind:Kind,id:string)=>void;
  clearCompare: (kind:Kind)=>void;
};
const empty = (): Record<Kind,string[]> => ({ films:[], cameras:[] });
const StoreContext = createContext<Store | null>(null);
const key = "film-index-v1";
type WebTool={name:string;title:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown};
type WebDocument=Document & {modelContext?:{registerTool:(tool:WebTool,options:{signal:AbortSignal})=>void|Promise<void>}};

export function StoreProvider({children}:{children:React.ReactNode}) {
  const [favorites,setFavorites] = useState(empty);
  const [compare,setCompare] = useState(empty);
  const [loaded,setLoaded] = useState(false);
  useEffect(()=>{
    try { const saved=JSON.parse(localStorage.getItem(key)||"{}"); setFavorites({films:saved.favorites?.films||[],cameras:saved.favorites?.cameras||[]}); setCompare({films:saved.compare?.films||[],cameras:saved.compare?.cameras||[]}); } catch { /* ignore invalid old preference */ }
    setLoaded(true);
  },[]);
  useEffect(()=>{if(loaded)localStorage.setItem(key,JSON.stringify({favorites,compare}));},[favorites,compare,loaded]);
  useEffect(()=>{
    const context=(document as WebDocument).modelContext;
    if(!context?.registerTool)return;
    const lifecycle=new AbortController();
    const register=(tool:WebTool)=>{try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* unsupported browser */}};
    register({name:"search_film_cabinet",title:"Search FILM CABINET",description:"Search local film and camera records by product, brand, ISO, or scenario. This does not change the page.",inputSchema:{type:"object",properties:{query:{type:"string",minLength:1},kind:{type:"string",enum:["films","cameras","all"]}},required:["query"],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){const value=input as {query?:unknown;kind?:unknown};if(typeof value?.query!=="string"||!value.query.trim())throw new Error("query must be a non-empty string");if(value.kind!==undefined&&!(["films","cameras","all"] as unknown[]).includes(value.kind))throw new Error("invalid kind");const q=value.query.toLowerCase();const kind=value.kind||"all";return {films:kind==="cameras"?[]:films.filter(x=>`${brandById[x.brandId].name} ${x.name} ISO ${x.iso} ${x.recommendedFor.join(" ")}`.toLowerCase().includes(q)).slice(0,20).map(x=>({id:x.id,name:`${brandById[x.brandId].name} ${x.name}`,url:`/film/${x.id}`})),cameras:kind==="films"?[]:cameras.filter(x=>`${brandById[x.brandId].name} ${x.name} ISO ${x.iso} ${x.embeddedFilmName||""}`.toLowerCase().includes(q)).slice(0,20).map(x=>({id:x.id,name:`${brandById[x.brandId].name} ${x.name}`,url:`/camera/${x.id}`}))};}});
    register({name:"save_film_cabinet_favorites",title:"Save FILM CABINET favorites",description:"Save selected film or camera records to this browser's Favorites list.",inputSchema:{type:"object",properties:{kind:{type:"string",enum:["films","cameras"]},ids:{type:"array",items:{type:"string"},minItems:1,maxItems:20}},required:["kind","ids"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const value=input as {kind?:unknown;ids?:unknown};if(value.kind!=="films"&&value.kind!=="cameras")throw new Error("invalid kind");if(!Array.isArray(value.ids)||!value.ids.length||value.ids.length>20||!value.ids.every(x=>typeof x==="string"))throw new Error("invalid ids");const valid=new Set((value.kind==="films"?films:cameras).map(x=>x.id));if(value.ids.some(x=>!valid.has(x)))throw new Error("unknown id");const saved=JSON.parse(localStorage.getItem(key)||"{}");const next={films:saved.favorites?.films||[],cameras:saved.favorites?.cameras||[]};next[value.kind]=Array.from(new Set([...next[value.kind],...value.ids]));localStorage.setItem(key,JSON.stringify({...saved,favorites:next}));setFavorites(next);return {kind:value.kind,savedIds:value.ids,total:next[value.kind].length};}});
    return ()=>lifecycle.abort();
  },[]);
  const value = useMemo<Store>(()=>({
    favorites,compare,
    toggleFavorite:(kind,id)=>setFavorites(prev=>({...prev,[kind]:prev[kind].includes(id)?prev[kind].filter(x=>x!==id):[...prev[kind],id]})),
    toggleCompare:(kind,id)=>setCompare(prev=>({...prev,[kind]:prev[kind].includes(id)?prev[kind].filter(x=>x!==id):prev[kind].length<4?[...prev[kind],id]:prev[kind]})),
    clearCompare:(kind)=>setCompare(prev=>({...prev,[kind]:[]})),
  }),[favorites,compare]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(){const value=useContext(StoreContext);if(!value)throw new Error("StoreProvider required");return value;}
