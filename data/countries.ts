export const countries = [
  { name:"미국", flag:"🇺🇸" }, { name:"일본", flag:"🇯🇵" }, { name:"영국", flag:"🇬🇧" },
  { name:"오스트리아", flag:"🇦🇹" }, { name:"독일", flag:"🇩🇪" }, { name:"홍콩", flag:"🇭🇰" },
  { name:"호주", flag:"🇦🇺" }, { name:"캐나다", flag:"🇨🇦" }, { name:"중국", flag:"🇨🇳" },
  { name:"체코", flag:"🇨🇿" }, { name:"프랑스", flag:"🇫🇷" }, { name:"이탈리아", flag:"🇮🇹" },
  { name:"스페인", flag:"🇪🇸" }, { name:"핀란드", flag:"🇫🇮" },
  { name:"기타 / 불명", flag:"🌐" },
];

export const countryFlag = (name: string) => countries.find((country) => country.name === name)?.flag ?? "🌐";
