"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Heart, GitCompareArrows } from "lucide-react";
import { useState } from "react";
import { useStore } from "./store";

const links = [
  ["FILMS","/films"],["CAMERAS","/cameras"],["EXCLUSIVE FILMS","/exclusive-films"],
  ["BRANDS","/brands"],["COUNTRIES","/countries"],["DISCOVER","/discover"],
  ["COMPARE","/compare"],["FAVORITES","/favorites"],["GUIDE","/guide"],
];
export function Navigation(){
  const [open,setOpen]=useState(false); const path=usePathname(); const {compare,favorites}=useStore();
  return <header className="site-header">
    <div className="topline"><span>THE ANALOG INDEX · ISSUE 001</span><span>35MM FILM & CAMERA DATABASE</span></div>
    <div className="nav-wrap">
      <Link href="/" className="wordmark" onClick={()=>setOpen(false)} aria-label="FILM INDEX 홈"><span>FILM</span><span>INDEX<span className="mark-dot">.</span></span></Link>
      <nav className="desktop-nav" aria-label="주 메뉴">{links.map(([label,url])=><Link key={url} href={url} className={path===url||path.startsWith(url+"/")?"active":""}>{label}</Link>)}</nav>
      <div className="nav-actions"><Link href="/favorites" className="icon-link" aria-label={`즐겨찾기 ${favorites.films.length+favorites.cameras.length}개`}><Heart size={19}/><span className="mini-count">{favorites.films.length+favorites.cameras.length}</span></Link><Link href="/compare" className="icon-link" aria-label={`비교 ${compare.films.length+compare.cameras.length}개`}><GitCompareArrows size={19}/><span className="mini-count">{compare.films.length+compare.cameras.length}</span></Link><Link href="/" className="icon-link search-icon" aria-label="검색"><Search size={19}/></Link><button className="mobile-menu-button" onClick={()=>setOpen(!open)} aria-label={open?"메뉴 닫기":"메뉴 열기"}>{open?<X size={23}/>:<Menu size={23}/>}</button></div>
    </div>
    {open&&<nav className="mobile-nav" aria-label="모바일 메뉴">{links.map(([label,url])=><Link key={url} href={url} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>}
  </header>;
}
