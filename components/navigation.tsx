"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Heart, GitCompareArrows, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useStore } from "./store";

const primary = [["FILMS", "/films"], ["CAMERAS", "/cameras"], ["EXCLUSIVE FILMS", "/exclusive-films"], ["DISCOVER", "/discover"]];
const secondary = [["BRANDS", "/brands"], ["COUNTRIES", "/countries"], ["GUIDE", "/guide"]];
const allLinks = [...primary, ...secondary, ["COMPARE", "/compare"], ["FAVORITES", "/favorites"]];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { compare, favorites } = useStore();
  const isActive = (url: string) => path === url || path.startsWith(url + "/");
  return <header className="site-header">
    <div className="topline"><span>THE ANALOG INDEX · ISSUE 001</span><span>35MM FILM & CAMERA DATABASE</span></div>
    <div className="nav-wrap">
      <Link href="/" className="wordmark" onClick={() => setOpen(false)} aria-label="FILM INDEX 홈"><span>FILM</span><span>INDEX<span className="mark-dot">.</span></span></Link>
      <nav className="desktop-nav" aria-label="주 메뉴">
        {primary.map(([label, url]) => <Link key={url} href={url} className={`${isActive(url) ? "active" : ""} ${url === "/exclusive-films" ? "nav-exclusive" : ""}`}>{label}</Link>)}
        <details className="nav-more"><summary className={secondary.some(([, url]) => isActive(url)) ? "active" : ""}>MORE <ChevronDown size={14} /></summary><div className="nav-more-menu">{secondary.map(([label, url]) => <Link key={url} href={url} className={isActive(url) ? "active" : ""}>{label}</Link>)}</div></details>
      </nav>
      <div className="nav-actions">
        <Link href="/compare" className={`nav-tool ${isActive("/compare") ? "active" : ""}`} aria-label={`비교 ${compare.films.length + compare.cameras.length}개`}><GitCompareArrows size={18}/><span>비교</span>{compare.films.length + compare.cameras.length > 0 && <b>{compare.films.length + compare.cameras.length}</b>}</Link>
        <Link href="/favorites" className={`nav-tool ${isActive("/favorites") ? "active" : ""}`} aria-label={`즐겨찾기 ${favorites.films.length + favorites.cameras.length}개`}><Heart size={18}/><span>즐겨찾기</span>{favorites.films.length + favorites.cameras.length > 0 && <b>{favorites.films.length + favorites.cameras.length}</b>}</Link>
        <Link href="/#site-search" className="icon-link search-icon" aria-label="홈에서 검색"><Search size={19}/></Link>
        <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open}>{open ? <X size={23}/> : <Menu size={23}/>}</button>
      </div>
    </div>
    {open && <nav className="mobile-nav" aria-label="모바일 메뉴">{allLinks.map(([label, url]) => <Link key={url} href={url} className={isActive(url) ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>)}</nav>}
  </header>;
}
