import { Brand } from "./types";

export const brands: Brand[] = [
  { id:"kodak", name:"Kodak", country:"미국", group:"실제 필름 제조사", form:"직접 제조사", makesFilm:true, character:"따뜻한 데일리 컬러부터 전문용 네거티브까지", color:"#e7b423" },
  { id:"fujifilm", name:"Fujifilm", country:"일본", group:"실제 필름 제조사", form:"직접 제조사", makesFilm:true, character:"선명한 녹색과 균형 잡힌 일상 컬러", color:"#50a781" },
  { id:"ilford", name:"ILFORD PHOTO", country:"영국", group:"흑백 전문", form:"직접 제조사", makesFilm:true, character:"입문부터 암실 작업까지 이어지는 흑백의 표준", color:"#4b5969" },
  { id:"harman", name:"HARMAN Photo", country:"영국", group:"실제 필름 제조사", form:"직접 제조사", makesFilm:true, character:"영국에서 만드는 개성 강한 컬러 필름", color:"#e27356" },
  { id:"cinestill", name:"CineStill", country:"미국", group:"영화용 필름 기반", form:"시네마 필름 가공", makesFilm:false, character:"영화용 원판을 스틸 사진에 맞게 가공", color:"#dc505d" },
  { id:"lomography", name:"Lomography", country:"오스트리아", group:"특수 컬러 / 실험", form:"기획 브랜드", makesFilm:false, character:"예측할 수 없는 색과 실험적인 표현", color:"#875eb6" },
  { id:"rollei", name:"Rollei Analog", country:"독일", group:"흑백 / 특수", form:"기획 브랜드", makesFilm:false, character:"저감도 흑백과 특수 감광 재료", color:"#526070" },
  { id:"agfaphoto", name:"AgfaPhoto", country:"독일", group:"흑백 / 특수", form:"기획 브랜드", makesFilm:false, character:"APX 흑백과 LeBox 일회용 카메라", color:"#e4654d" },
  { id:"reto", name:"RETO Project", country:"홍콩", group:"특수 컬러 / 실험", form:"기획 브랜드", makesFilm:false, character:"색 효과와 프리 익스포즈드 디자인", color:"#7457bd" },
  { id:"filmneverdie", name:"FilmNeverDie", country:"호주", group:"인디 / OEM / 리스풀", form:"기획 브랜드", makesFilm:false, character:"호주 기반 독립 필름과 카메라", color:"#4398a5" },
  { id:"flicfilm", name:"Flic Film", country:"캐나다", group:"영화용 필름 기반", form:"리스풀 / 기획 브랜드", makesFilm:false, character:"다양한 원판을 새로운 감각으로 소개", color:"#e1784e" },
  { id:"escura", name:"Escura", country:"홍콩", group:"인디 / OEM / 리스풀", form:"기획 브랜드", makesFilm:false, character:"가벼운 일상 촬영용 컬러 필름", color:"#d8887b" },
  { id:"hitchcock", name:"Hitchcock", country:"기타 / 불명", group:"영화용 필름 기반", form:"기획 브랜드", makesFilm:false, character:"영화적 톤을 지향하는 독립 브랜드", color:"#69738a" },
  { id:"vibe", name:"VIBE Photo", country:"기타 / 불명", group:"인디 / OEM / 리스풀", form:"기획 브랜드", makesFilm:false, character:"원판 공개가 제한적인 독립 필름", color:"#be8b59" },
  { id:"lucky", name:"Lucky Film", country:"중국", group:"실제 필름 제조사", form:"직접 제조사", makesFilm:true, character:"중국의 오랜 감광 재료 브랜드", color:"#d04d4b" },
  { id:"lovingheart", name:"Loving Heart", country:"기타 / 불명", group:"인디 / OEM / 리스풀", form:"기획 브랜드", makesFilm:false, character:"감성적인 패키지의 독립 필름", color:"#e28191" },
  { id:"manual", name:"Manual", country:"미국", group:"영화용 필름 기반", form:"기획 브랜드", makesFilm:false, character:"뉴욕 기반의 현대적인 필름 문화", color:"#365f88" },
  { id:"dubblefilm", name:"Dubblefilm", country:"기타 / 불명", group:"인디 / OEM / 리스풀", form:"기획 브랜드", makesFilm:false, character:"재장전 가능한 SHOW 카메라와 실험적인 컬러 제품", color:"#e28b57" },
];

export const brandById = Object.fromEntries(brands.map((brand) => [brand.id, brand])) as Record<string, Brand>;
