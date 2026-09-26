import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require=createRequire(import.meta.url);
const ts=require("typescript");
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const cache=new Map();
function load(relative){
  const file=resolve(root,relative);
  if(cache.has(file))return cache.get(file).exports;
  const loadedModule={exports:{}};cache.set(file,loadedModule);
  const code=ts.transpileModule(readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=specifier=>specifier.startsWith(".")?load(resolve(dirname(file),specifier)+".ts"):require(specifier);
  new Function("require","module","exports",code)(localRequire,loadedModule,loadedModule.exports);
  return loadedModule.exports;
}

const {films}=load("data/films.ts");
const {recommendFilms,isRecommendationEligible}=load("lib/recommend-films.ts");
const cases=[
  ["Portrait + Daylight + Natural",{shooting:"portrait",light:"bright-daylight",look:"natural"}],
  ["Street + Overcast + Vivid",{shooting:"street",light:"overcast",look:"vivid"}],
  ["Night + Night + Cinematic",{shooting:"night",light:"night",look:"cinema"}],
  ["Experimental + Any + Experimental",{shooting:"experimental",light:"any",look:"experimental"}],
  ["Any + Daylight + B&W",{shooting:"any",light:"bright-daylight",look:"bw"}],
];
let failed=false;
for(const [name,criteria] of cases){
  const results=recommendFilms(films,criteria,3);
  const invalid=results.filter(result=>!isRecommendationEligible(result.film,criteria.look==="experimental"||criteria.look==="cinema"||criteria.shooting==="experimental"));
  if(!results.length||invalid.length){failed=true;console.error(`[FAIL] ${name}`);continue;}
  console.log(`[PASS] ${name}: ${results.map(result=>result.film.name).join(" / ")}`);
}
if(failed)process.exitCode=1;
