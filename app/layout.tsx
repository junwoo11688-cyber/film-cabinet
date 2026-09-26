import type { Metadata } from "next";
import "./globals.css";
import "./redesign.css";
import { Navigation } from "@/components/navigation";
import { StoreProvider } from "@/components/store";

export const metadata: Metadata = {
  title: { default:"FILM CABINET | 35mm Film & Camera Archive", template:"%s | FILM CABINET" },
  description:"필름을 고르고, 카메라 안의 필름과 실제 제조 관계까지 꺼내 보는 35mm 필름 아카이브.",
  icons:{icon:"/favicon.svg"},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ko"><body><StoreProvider><Navigation/><main>{children}</main><footer className="site-footer"><div className="container footer-inner"><div className="footer-logo">FILM<br/>CABINET<span>.</span></div><p>35mm Film & Camera Archive<br/>확인되지 않은 원판은 추정하지 않습니다.</p><nav aria-label="푸터 메뉴"><a href="/films">Films</a><a href="/cameras">Cameras</a><a href="/discover">Discover</a><a href="/guide">Guide</a></nav><div className="footer-data"><span>Last updated · 2026-09-26</span><a href="/data-audit">Database status ↗</a></div><small>© 2026 FILM CABINET · 데이터는 제품 시기와 지역에 따라 달라질 수 있습니다.</small></div></footer></StoreProvider></body></html>;
}
