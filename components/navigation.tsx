"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { SearchPalette } from "./search-palette";

const links = [["FILMS", "/films"], ["CAMERAS", "/cameras"], ["DISCOVER", "/discover"], ["TODAY'S FILM", "/recommend"], ["COMPARE", "/compare"], ["GUIDE", "/guide"]] as const;

export function Navigation() {
  const path = usePathname();
  const { favorites } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const active = (url:string) => path === url || path.startsWith(url + "/") || (url === "/discover" && path.startsWith("/exclusive-films"));

  useEffect(() => {
    const saved = localStorage.getItem("film-cabinet-theme");
    if (saved === "dark") { setTheme("dark"); document.documentElement.dataset.theme = "dark"; }
    const open = () => setSearchOpen(true);
    const shortcut = (event:KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("open-film-cabinet-search", open);
    window.addEventListener("keydown", shortcut);
    return () => { window.removeEventListener("open-film-cabinet-search", open); window.removeEventListener("keydown", shortcut); };
  }, []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [path]);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next); document.documentElement.dataset.theme = next;
    localStorage.setItem("film-cabinet-theme", next);
  };

  return <>
    <header className="site-header cabinet-header">
      <div className="nav-wrap">
        <Link href="/" className="wordmark" aria-label="FILM CABINET 홈"><span>FILM</span><span>CABINET<span className="mark-dot">.</span></span></Link>
        <nav className="desktop-nav" aria-label="주 메뉴">{links.map(([label,url]) => <Link key={url} href={url} className={active(url) ? "active" : ""}>{label}</Link>)}</nav>
        <div className="nav-actions">
          <button className="nav-icon" type="button" onClick={() => setSearchOpen(true)} aria-label="전체 검색 열기" title="검색 (Ctrl K)"><Search size={20}/></button>
          <Link href="/favorites" className={`nav-icon nav-favorite ${active("/favorites") ? "active" : ""}`} aria-label={`내 캐비닛, 저장 항목 ${favorites.films.length + favorites.cameras.length}개`}><Heart size={20}/>{favorites.films.length + favorites.cameras.length > 0 && <b>{favorites.films.length + favorites.cameras.length}</b>}</Link>
          <button className="nav-icon theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "light" ? "어두운 테마 사용" : "밝은 테마 사용"} title="테마 변경">{theme === "light" ? <Moon size={20}/> : <Sun size={20}/>}</button>
          <button className="nav-icon mobile-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={menuOpen}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="모바일 메뉴">{[...links,["FAVORITES","/favorites"] as const].map(([label,url]) => <Link key={url} href={url} className={active(url) ? "active" : ""} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
    </header>
    <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)}/>
  </>;
}
