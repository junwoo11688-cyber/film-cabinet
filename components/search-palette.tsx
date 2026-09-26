"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { films } from "@/data/films";
import { cameras } from "@/data/cameras";
import { brands, brandById } from "@/data/brands";
import { matchesFilmSearch, normalizeSearchText } from "@/lib/film-search";

export function SearchPalette({open,onClose}:{open:boolean;onClose:()=>void}) {
  const [query,setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setQuery("");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => input.current?.focus(), 0);
    const escape = (event:KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", escape);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previous; document.removeEventListener("keydown", escape); };
  }, [open,onClose]);
  const results = useMemo(() => {
    const raw = query.trim();
    if (!raw) return null;
    const normalized=normalizeSearchText(raw);
    const match = (value:string) => normalizeSearchText(value).includes(normalized);
    return {
      films: films.filter(x => matchesFilmSearch(x,brandById[x.brandId].name,raw)).slice(0,6),
      cameras: cameras.filter(x => match(`${brandById[x.brandId].name} ${x.name} ISO ${x.iso} ${x.embeddedFilmName || ""}`)).slice(0,4),
      brands: brands.filter(x => match(x.name)).slice(0,4),
    };
  }, [query]);
  if (!open) return null;
  const empty = results && !results.films.length && !results.cameras.length && !results.brands.length;
  return <div className="search-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="search-dialog" role="dialog" aria-modal="true" aria-label="FILM CABINET 검색">
      <div className="search-dialog-head"><Search size={22}/><input ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Kodak Gold 200, ISO 400, QuickSnap..." aria-label="필름, 카메라, 브랜드 검색"/><button type="button" aria-label="검색 닫기" onClick={onClose}><X size={20}/></button></div>
      <div className="search-dialog-body">
        {!results && <><span className="search-group-title">빠른 검색</span><div className="search-suggestions">{["Kodak","ISO 400","800T","QuickSnap","흑백"].map(x => <button key={x} type="button" onClick={() => setQuery(x)}>{x}</button>)}</div></>}
        {results && <>
          {results.films.length > 0 && <div className="search-group"><span className="search-group-title">FILMS</span>{results.films.map(x => <Link key={x.id} href={`/film/${x.id}`} onClick={onClose}><span>{brandById[x.brandId].name} <strong>{x.name}</strong></span><small>ISO {x.iso} · {x.process}</small></Link>)}</div>}
          {results.cameras.length > 0 && <div className="search-group"><span className="search-group-title">CAMERAS</span>{results.cameras.map(x => <Link key={x.id} href={`/camera/${x.id}`} onClick={onClose}><span>{brandById[x.brandId].name} <strong>{x.name}</strong></span><small>{x.exposures} EXP</small></Link>)}</div>}
          {results.brands.length > 0 && <div className="search-group"><span className="search-group-title">BRANDS</span>{results.brands.map(x => <Link key={x.id} href={`/brand/${x.id}`} onClick={onClose}><strong>{x.name}</strong><small>{x.country}</small></Link>)}</div>}
          {empty && <div className="search-empty">검색 결과가 없습니다. 다른 필름명이나 ISO로 찾아보세요.</div>}
        </>}
      </div>
      <div className="search-dialog-foot">ESC 닫기 <span>FILM CABINET · 35mm Archive</span></div>
    </section>
  </div>;
}
