import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
function load(relative) {
  const file = resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports:{}};
  cache.set(file,module);
  const code = ts.transpileModule(readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire = specifier => specifier.startsWith(".") ? load(resolve(dirname(file),specifier)+".ts") : require(specifier);
  new Function("require","module","exports",code)(localRequire,module,module.exports);
  return module.exports;
}
const {films} = load("data/films.ts");
const {brands} = load("data/brands.ts");
const {cameras} = load("data/cameras.ts");
const {canonicalFilms} = load("data/master-catalog.ts");
const {catalogExpansions} = load("data/catalog-expansion.ts");
const {auditCatalog} = load("lib/catalog-audit.ts");
const report = auditCatalog(films,brands,cameras,canonicalFilms);
console.log("FILM CABINET DATA AUDIT");
console.log(`Registered films: ${report.registeredFilms}`);
console.log(`Canonical target films: ${report.canonicalFilms}`);
console.log(`Missing films: ${report.missing.length}`);
console.log(`Possible duplicates: ${report.duplicates.length}`);
console.log(`Unknown availability: ${report.unknownAvailability.length}`);
console.log(`Orphaned brand references: ${report.issues.filter(issue=>issue.code==="orphan-brand").length}`);
console.log(`Regional films: ${report.regional.length}`);
console.log(`Out of stock: ${report.outOfStock.length}`);
console.log(`Newly discovered: ${catalogExpansions.filter(item=>item.newlyDiscovered).length}`);
for (const [label,items] of [["MISSING",report.missing.map(item=>`${item.brandId} ${item.name}`)],["ISSUES",report.issues.map(item=>item.detail)],["NEWLY DISCOVERED",catalogExpansions.filter(item=>item.newlyDiscovered).map(item=>`${item.brandId} ${item.name}`)]]) {
  console.log(`\n${label}`);
  console.log(items.length ? items.map(item=>`- ${item}`).join("\n") : "- 없음");
}
if (report.missing.length || report.duplicates.length || report.issues.some(issue=>!["official-no-source"].includes(issue.code))) process.exitCode=1;
