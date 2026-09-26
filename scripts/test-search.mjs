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
  const loadedModule={exports:{}};
  cache.set(file,loadedModule);
  const code=ts.transpileModule(readFileSync(file,"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},
  }).outputText;
  const localRequire=specifier=>specifier.startsWith(".")?load(resolve(dirname(file),specifier)+".ts"):require(specifier);
  new Function("require","module","exports",code)(localRequire,loadedModule,loadedModule.exports);
  return loadedModule.exports;
}

const {films}=load("data/films.ts");
const {brandById}=load("data/brands.ts");
const {matchesFilmSearch}=load("lib/film-search.ts");
const cases=[
  ["5219","kodak-vision3-500t-5219"],
  ["500T","kodak-vision3-500t-5219"],
  ["Vision 500T","kodak-vision3-500t-5219"],
  ["VISION3","kodak-vision3-500t-5219"],
  ["Double X","kodak-eastman-double-x-5222"],
  ["Double-X","kodak-eastman-double-x-5222"],
  ["5222","kodak-eastman-double-x-5222"],
  ["portra400","kodak-portra-400"],
];

let failed=false;
for(const [query,expectedId] of cases){
  const matches=films.filter(film=>matchesFilmSearch(film,brandById[film.brandId]?.name||film.brandId,query));
  if(!matches.some(film=>film.id===expectedId)){
    failed=true;
    console.error(`[FAIL] ${query}: expected ${expectedId}`);
    continue;
  }
  console.log(`[PASS] ${query}: ${matches.slice(0,3).map(film=>film.name).join(" / ")}`);
}

if(failed)process.exitCode=1;
