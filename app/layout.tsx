import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { StoreProvider } from "@/components/store";

export const metadata: Metadata = {
  title: { default:"FILM INDEX | 35mm Film & Camera Database", template:"%s | FILM INDEX" },
  description:"브랜드, ISO, 색감, 현상 방식별 35mm 필름과 일회용 카메라를 탐색하는 현대적인 필름 도감.",
  icons:{icon:"/favicon.svg"},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ko"><body><StoreProvider><Navigation/><main>{children}</main><footer className="site-footer"><div className="container footer-inner"><div className="footer-logo">FILM<br/>INDEX<span>.</span></div><p>35mm Film & Camera Database<br/>확인되지 않은 원판은 추정하지 않습니다.</p><div><a href="/guide">용어 가이드</a><a href="/exclusive-films">카메라 속 필름</a><a href="/brands">브랜드</a></div><small>© 2026 FILM INDEX · 데이터는 제품 시기와 지역에 따라 달라질 수 있습니다.</small></div></footer></StoreProvider></body></html>;
}
