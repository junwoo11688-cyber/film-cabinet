import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites-view";
export const metadata:Metadata={title:"즐겨찾기",description:"좋아하는 필름과 카메라를 브라우저에 저장해 다시 찾아보세요."};
export default function Page(){return <div className="container page-shell"><div className="page-heading"><span className="section-kicker">YOUR PERSONAL SHELF</span><h1>Favorites</h1><p>눈여겨본 필름과 카메라를 모아두세요. 즐겨찾기는 사용 중인 브라우저에 저장됩니다.</p></div><FavoritesView/></div>}
