"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

type Category =
  | "alkalni metal"
  | "alkalnozemni metal"
  | "prijelazni metal"
  | "post-tranzicioni metal"
  | "polumetal"
  | "nemetal"
  | "halogen"
  | "plemeniti gas"
  | "lantanid"
  | "aktinid";

type Element = {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: Category;
};

const groupCharacteristics: Record<number, string[]> = {
  1: [
    "Alkalni metali su veoma reaktivni i čuvaju se u inertnoj atmosferi ili ulju.",
    "Formiraju jake baze (hidrokside) u kontaktu sa vodom.",
    "Tipično imaju +1 oksidaciono stanje i niske tačke topljenja.",
  ],
  2: [
    "Alkalnozemni metali su srebrnasto sjajni i manje reaktivni od alkalnih.",
    "Grade slabo rastvorljive sulfate i karbonate.",
    "Dominantno oksidaciono stanje je +2.",
  ],
  3: [
    "Skandijumska grupa obuhvata prelazne metale sa stabilnim +3 stanjem.",
    "Često služe kao katalizatori i legirajući dodaci.",
    "Lanac započinje prelaznim metalima i otvara f-blok.",
  ],
  4: [
    "Titanska grupa ima visoku čvrstoću i otpornost na koroziju.",
    "Titana(IV) oksidi su važni pigmenti i fotokatalizatori.",
    "Stabilna oksidaciona stanja: +4 i +3.",
  ],
  5: [
    "Vanadijumska grupa pokazuje više oksidacionih stanja (+2 do +5).",
    "Vanadijum oksidi su česti katalizatori u industriji.",
    "Elementi su tipični prelazni metali sa promenljivom koordinacijom.",
  ],
  6: [
    "Hromova grupa ima tvrde, koroziono otporne metale.",
    "Hrom(III) i hrom(VI) spojevi imaju različitu toksičnost i boju.",
    "Volfram ima veoma visoku tačku topljenja.",
  ],
  7: [
    "Manganova grupa poseduje širok spektar oksidacionih stanja.",
    "Rutenijum i osmijum formiraju jake katalizatore.",
    "MnO₂ je klasični oksidans u hemiji.",
  ],
  8: [
    "Gvozdena grupa dominira oksidacionim stanjima +2 i +3.",
    "Gvožđe, kobalt i nikl ključni su za magnetna i biohemijska svojstva.",
    "Kompleksi su česti i stabilni.",
  ],
  9: [
    "Kobaltna grupa ima plemenita svojstva i koristi se u legurama.",
    "Rodijum i iridijum su vrhunski katalizatori za hidrogenaciju.",
    "Kompleksi često pokazuju jake boje.",
  ],
  10: [
    "Niklova grupa obuhvata plemenite metale sa stabilnim kompleksomima.",
    "Paladijum je ključan za katalitičke procese (Suzuki, Heck).",
    "Platina je inertna, ali katalitički aktivna.",
  ],
  11: [
    "Bakrova grupa su kovan metali sa visokim električnim provodljivostima.",
    "Poznati po monovalentnim i divalentnim stanjima.",
    "Zlato je hemijski inertno i plemenito.",
  ],
  12: [
    "Cinkova grupa često formira +2 stanje sa tetraedarskom koordinacijom.",
    "Hg ima jedinstvene tečne osobine na sobnoj temperaturi.",
    "Kadijum i živin spojevi su toksični.",
  ],
  13: [
    "Borova grupa prelazi od nemetala (bor) do metala (aluminijum).",
    "Česti su kovalentni spojevi i Lewis-ove kiseline (BF₃, AlCl₃).",
    "Talasasta promena metalnog karaktera kroz grupu.",
  ],
  14: [
    "Ugljenikova grupa sadrži nemetale, polumetale i metale.",
    "Karbonska hemija čini osnovu organske hemije.",
    "Silicijum je ključan za poluprovodnike.",
  ],
  15: [
    "Azotna grupa (pniktogeni) pokazuje stanja od -3 do +5.",
    "Fosfor i arsen formiraju raznovrsne kovalentne strukture.",
    "Bismut je najmanje toksičan među težim članovima.",
  ],
  16: [
    "Halkogeni (grupa kiseonika) prelaze od nemetala do polumetala.",
    "Sulfur i selen imaju bogatu alotripsiju.",
    "Telur i polonijum pokazuju metalniji karakter.",
  ],
  17: [
    "Halogeni su veoma reaktivni nemetali, snažni oksidansi.",
    "Formiraju kiseline tipa HX i soli halogenida.",
    "Reaktivnost opada niz grupu, tačka topljenja raste.",
  ],
  18: [
    "Plemeniti gasovi su inertni, monatomni i bezbojni.",
    "Vrlo slabo reaguju; samo teži članovi formiraju spojeve sa F i O.",
    "Koriste se za inertne atmosfere i rasvetu.",
  ],
};

const categoryDefaults: Record<
  Category,
  { physical: string[]; chemical: string[]; reactions: string[] }
> = {
  "alkalni metal": {
    physical: ["Meki, niska gustina", "Metalni sjaj, tačka topljenja niska", "Izuzetno reaktivni na vazduhu"],
    chemical: ["Brzo oksidišu", "Reaguju burno sa vodom", "Formiraju jake baze (MOH)"],
    reactions: [
      "2 M + 2 H₂O → 2 MOH + H₂↑",
      "2 M + Cl₂ → 2 MCl",
      "4 M + O₂ → 2 M₂O",
    ],
  },
  "alkalnozemni metal": {
    physical: ["Srebrnasti, reaktivni", "Gustina veća od alkalnih metala", "Relativno meki"],
    chemical: ["Formiraju M(OH)₂ u vodi", "Sagorevaju u vazduhu dajući okside", "Grade slabo rastvorljive sulfate i karbonate"],
    reactions: [
      "M + 2 H₂O → M(OH)₂ + H₂↑",
      "2 M + O₂ → 2 MO",
      "M + 2 HCl → MCl₂ + H₂↑",
    ],
  },
  "prijelazni metal": {
    physical: ["Tvrdi, sjajni", "Visoka tačka topljenja", "Dobri provodnici"],
    chemical: ["Višestruka oksidaciona stanja", "Formiraju obojene komplekse", "Često katalizatori"],
    reactions: [
      "M + O₂ → MOₓ (oksidi raznih valenci)",
      "M + 2 HCl → MCl₂ + H₂↑",
      "Kompleksacija: M²⁺ + 6 NH₃ → [M(NH₃)₆]²⁺",
    ],
  },
  "post-tranzicioni metal": {
    physical: ["Kovani, niža tačka topljenja od prelaznih", "Dobar električni provodnik", "Često mehki metali"],
    chemical: ["Obično fiksna oksidaciona stanja (+1, +3)", "Grade okside i halogenide", "Mogu pokazati amfotersko ponašanje"],
    reactions: [
      "2 M + 3 Cl₂ → 2 MCl₃",
      "M + O₂ → MOₓ (amfoterski oksidi)",
      "M + kiselina → M²⁺ + H₂↑ (sporo za plemenite)",
    ],
  },
  "polumetal": {
    physical: ["Poluprovodničko ponašanje", "Lomljivi, sjajni", "Gustina srednja"],
    chemical: ["Pokazuju i metalna i nemetalska svojstva", "Grade kovalentne mreže", "Oksidi su često amfoterni"],
    reactions: [
      "E + O₂ → EO₂/EO₃ (kovalentni oksidi)",
      "E + halogen → EX₃/EX₅",
      "Legiranje: E + metal → intermetalni spoj",
    ],
  },
  nemetal: {
    physical: ["Nemetalni sjaj ili bez sjaja", "Niska gustina", "Loši provodnici"],
    chemical: ["Grade kovalentne veze", "Formiraju kiseline ili oksokiseline", "Često oksidansi"],
    reactions: [
      "E + H₂ → EHₓ (kovalentni hidridi)",
      "E + O₂ → oksidi (kiseli)",
      "E + metal → jon/kovalentni halogenid/sulfid",
    ],
  },
  halogen: {
    physical: ["Dvoatomni molekuli", "Reaktivnost opada niz grupu", "Tačke ključanja rastu niz grupu"],
    chemical: ["Snažni oksidansi", "Reaguju sa metalima u soli", "Disproporcionacija u alkalnim rastvorima"],
    reactions: [
      "H₂ + X₂ → 2 HX",
      "2 Na + X₂ → 2 NaX",
      "3 Cl₂ + 6 NaOH (hladno) → 5 NaCl + NaClO₃ + 3 H₂O",
    ],
  },
  "plemeniti gas": {
    physical: ["Monatomni, bezbojni gasovi", "Vrlo niska reaktivnost", "Neprovodnici"],
    chemical: ["Skoro inertni", "Teži članovi formiraju ksenon(II/VI) fluoride", "Koriste se kao inertni medijum"],
    reactions: [
      "Xe + F₂ → XeF₂/XeF₄ (pod pritiskom)",
      "XeF₂ + H₂O → Xe + 2 HF + ½ O₂",
      "Radon (radioaktivan) ne koristi se u reakcijama",
    ],
  },
  lantanid: {
    physical: ["Srebrnasti, mekani metali", "Magnetna i optička svojstva", "Visoka provodnost"],
    chemical: ["Tipično +3 stanje", "Formiraju koordinacione komplekse", "Reaktivni u vazduhu (oksidni sloj)"],
    reactions: [
      "2 Ln + 3 Cl₂ → 2 LnCl₃",
      "2 Ln + 3 H₂O → 2 Ln(OH)₃ + 3 H₂↑",
      "Ln + O₂ → Ln₂O₃",
    ],
  },
  aktinid: {
    physical: ["Teški, radioaktivni metali", "Gustina visoka", "Neki su paramagnetični"],
    chemical: ["Oksidaciona stanja +3 do +6 česta", "Kompleksna koordinacija", "Skoni hidridima/karbidima/nitridima"],
    reactions: [
      "An + O₂ → AnO₂/An₂O₃",
      "An + 6 F₂ → AnF₆ (za U, Np, Pu)",
      "An + kiselina → An³⁺ + H₂↑ (uz pasivaciju za U)",
    ],
  },
};

const groupNames: Record<number, string> = {
  1: "Alkalni metali",
  2: "Alkalnozemni metali",
  3: "Skandijumska grupa",
  4: "Titanska grupa",
  5: "Vanadijumska grupa",
  6: "Hromova grupa",
  7: "Manganova grupa",
  8: "Gvozdena grupa",
  9: "Kobaltna grupa",
  10: "Niklova grupa",
  11: "Bakrova grupa",
  12: "Cinkova grupa",
  13: "Borova grupa",
  14: "Ugljenikova grupa",
  15: "Azotna grupa",
  16: "Halkogeni",
  17: "Halogeni",
  18: "Plemeniti gasovi",
};

const CATEGORY_COLORS: Record<Category, string> = {
  "alkalni metal": "bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-500/20 dark:text-orange-100 dark:border-orange-400/30",
  "alkalnozemni metal": "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/20 dark:text-amber-50 dark:border-amber-400/30",
  "prijelazni metal": "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-500/20 dark:text-blue-50 dark:border-blue-400/30",
  "post-tranzicioni metal": "bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-50 dark:border-cyan-400/30",
  polumetal: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-50 dark:border-emerald-400/30",
  nemetal: "bg-lime-100 text-lime-900 border-lime-200 dark:bg-lime-500/20 dark:text-lime-50 dark:border-lime-400/30",
  halogen: "bg-pink-100 text-pink-900 border-pink-200 dark:bg-pink-500/20 dark:text-pink-50 dark:border-pink-400/30",
  "plemeniti gas": "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-500/20 dark:text-purple-50 dark:border-purple-400/30",
  lantanid: "bg-indigo-100 text-indigo-900 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-50 dark:border-indigo-400/30",
  aktinid: "bg-red-100 text-red-900 border-red-200 dark:bg-red-500/20 dark:text-red-50 dark:border-red-400/30",
};

const ELEMENTS: Element[] = [
  { atomicNumber: 1, symbol: "H", name: "Vodonik", group: 1, period: 1, category: "nemetal" },
  { atomicNumber: 2, symbol: "He", name: "Helijum", group: 18, period: 1, category: "plemeniti gas" },
  { atomicNumber: 3, symbol: "Li", name: "Litijum", group: 1, period: 2, category: "alkalni metal" },
  { atomicNumber: 4, symbol: "Be", name: "Berilijum", group: 2, period: 2, category: "alkalnozemni metal" },
  { atomicNumber: 5, symbol: "B", name: "Bor", group: 13, period: 2, category: "polumetal" },
  { atomicNumber: 6, symbol: "C", name: "Ugljenik", group: 14, period: 2, category: "nemetal" },
  { atomicNumber: 7, symbol: "N", name: "Azot", group: 15, period: 2, category: "nemetal" },
  { atomicNumber: 8, symbol: "O", name: "Kiseonik", group: 16, period: 2, category: "nemetal" },
  { atomicNumber: 9, symbol: "F", name: "Fluor", group: 17, period: 2, category: "halogen" },
  { atomicNumber: 10, symbol: "Ne", name: "Neon", group: 18, period: 2, category: "plemeniti gas" },
  { atomicNumber: 11, symbol: "Na", name: "Natrijum", group: 1, period: 3, category: "alkalni metal" },
  { atomicNumber: 12, symbol: "Mg", name: "Magnezijum", group: 2, period: 3, category: "alkalnozemni metal" },
  { atomicNumber: 13, symbol: "Al", name: "Aluminijum", group: 13, period: 3, category: "post-tranzicioni metal" },
  { atomicNumber: 14, symbol: "Si", name: "Silicijum", group: 14, period: 3, category: "polumetal" },
  { atomicNumber: 15, symbol: "P", name: "Fosfor", group: 15, period: 3, category: "nemetal" },
  { atomicNumber: 16, symbol: "S", name: "Sumpor", group: 16, period: 3, category: "nemetal" },
  { atomicNumber: 17, symbol: "Cl", name: "Hlor", group: 17, period: 3, category: "halogen" },
  { atomicNumber: 18, symbol: "Ar", name: "Argon", group: 18, period: 3, category: "plemeniti gas" },
  { atomicNumber: 19, symbol: "K", name: "Kalijum", group: 1, period: 4, category: "alkalni metal" },
  { atomicNumber: 20, symbol: "Ca", name: "Kalcijum", group: 2, period: 4, category: "alkalnozemni metal" },
  { atomicNumber: 21, symbol: "Sc", name: "Skandijum", group: 3, period: 4, category: "prijelazni metal" },
  { atomicNumber: 22, symbol: "Ti", name: "Titan", group: 4, period: 4, category: "prijelazni metal" },
  { atomicNumber: 23, symbol: "V", name: "Vanadijum", group: 5, period: 4, category: "prijelazni metal" },
  { atomicNumber: 24, symbol: "Cr", name: "Hrom", group: 6, period: 4, category: "prijelazni metal" },
  { atomicNumber: 25, symbol: "Mn", name: "Mangan", group: 7, period: 4, category: "prijelazni metal" },
  { atomicNumber: 26, symbol: "Fe", name: "Gvožđe", group: 8, period: 4, category: "prijelazni metal" },
  { atomicNumber: 27, symbol: "Co", name: "Kobalt", group: 9, period: 4, category: "prijelazni metal" },
  { atomicNumber: 28, symbol: "Ni", name: "Nikl", group: 10, period: 4, category: "prijelazni metal" },
  { atomicNumber: 29, symbol: "Cu", name: "Bakar", group: 11, period: 4, category: "prijelazni metal" },
  { atomicNumber: 30, symbol: "Zn", name: "Cink", group: 12, period: 4, category: "post-tranzicioni metal" },
  { atomicNumber: 31, symbol: "Ga", name: "Galijum", group: 13, period: 4, category: "post-tranzicioni metal" },
  { atomicNumber: 32, symbol: "Ge", name: "Germanijum", group: 14, period: 4, category: "polumetal" },
  { atomicNumber: 33, symbol: "As", name: "Arsen", group: 15, period: 4, category: "polumetal" },
  { atomicNumber: 34, symbol: "Se", name: "Selen", group: 16, period: 4, category: "nemetal" },
  { atomicNumber: 35, symbol: "Br", name: "Brom", group: 17, period: 4, category: "halogen" },
  { atomicNumber: 36, symbol: "Kr", name: "Kripton", group: 18, period: 4, category: "plemeniti gas" },
  { atomicNumber: 37, symbol: "Rb", name: "Rubidijum", group: 1, period: 5, category: "alkalni metal" },
  { atomicNumber: 38, symbol: "Sr", name: "Stroncijum", group: 2, period: 5, category: "alkalnozemni metal" },
  { atomicNumber: 39, symbol: "Y", name: "Itrijum", group: 3, period: 5, category: "prijelazni metal" },
  { atomicNumber: 40, symbol: "Zr", name: "Cirkonijum", group: 4, period: 5, category: "prijelazni metal" },
  { atomicNumber: 41, symbol: "Nb", name: "Niobijum", group: 5, period: 5, category: "prijelazni metal" },
  { atomicNumber: 42, symbol: "Mo", name: "Molibden", group: 6, period: 5, category: "prijelazni metal" },
  { atomicNumber: 43, symbol: "Tc", name: "Tehnecijum", group: 7, period: 5, category: "prijelazni metal" },
  { atomicNumber: 44, symbol: "Ru", name: "Rutenijum", group: 8, period: 5, category: "prijelazni metal" },
  { atomicNumber: 45, symbol: "Rh", name: "Rodijum", group: 9, period: 5, category: "prijelazni metal" },
  { atomicNumber: 46, symbol: "Pd", name: "Paladijum", group: 10, period: 5, category: "prijelazni metal" },
  { atomicNumber: 47, symbol: "Ag", name: "Srebro", group: 11, period: 5, category: "prijelazni metal" },
  { atomicNumber: 48, symbol: "Cd", name: "Kadijum", group: 12, period: 5, category: "post-tranzicioni metal" },
  { atomicNumber: 49, symbol: "In", name: "Indijum", group: 13, period: 5, category: "post-tranzicioni metal" },
  { atomicNumber: 50, symbol: "Sn", name: "Kalaj", group: 14, period: 5, category: "post-tranzicioni metal" },
  { atomicNumber: 51, symbol: "Sb", name: "Antimon", group: 15, period: 5, category: "polumetal" },
  { atomicNumber: 52, symbol: "Te", name: "Telur", group: 16, period: 5, category: "polumetal" },
  { atomicNumber: 53, symbol: "I", name: "Jod", group: 17, period: 5, category: "halogen" },
  { atomicNumber: 54, symbol: "Xe", name: "Ksenon", group: 18, period: 5, category: "plemeniti gas" },
  { atomicNumber: 55, symbol: "Cs", name: "Cezijum", group: 1, period: 6, category: "alkalni metal" },
  { atomicNumber: 56, symbol: "Ba", name: "Barijum", group: 2, period: 6, category: "alkalnozemni metal" },
  { atomicNumber: 57, symbol: "La", name: "Lantan", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 58, symbol: "Ce", name: "Cerijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 59, symbol: "Pr", name: "Praseodimijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 60, symbol: "Nd", name: "Neodimijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 61, symbol: "Pm", name: "Prometijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 62, symbol: "Sm", name: "Samarium", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 63, symbol: "Eu", name: "Evropijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 64, symbol: "Gd", name: "Gadolinijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 65, symbol: "Tb", name: "Terbijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 66, symbol: "Dy", name: "Disprozijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 67, symbol: "Ho", name: "Holmijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 68, symbol: "Er", name: "Erbijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 69, symbol: "Tm", name: "Tulijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 70, symbol: "Yb", name: "Iterbijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 71, symbol: "Lu", name: "Lutesijum", group: 3, period: 6, category: "lantanid" },
  { atomicNumber: 72, symbol: "Hf", name: "Hafnijum", group: 4, period: 6, category: "prijelazni metal" },
  { atomicNumber: 73, symbol: "Ta", name: "Tantal", group: 5, period: 6, category: "prijelazni metal" },
  { atomicNumber: 74, symbol: "W", name: "Volfram", group: 6, period: 6, category: "prijelazni metal" },
  { atomicNumber: 75, symbol: "Re", name: "Renijum", group: 7, period: 6, category: "prijelazni metal" },
  { atomicNumber: 76, symbol: "Os", name: "Osmijum", group: 8, period: 6, category: "prijelazni metal" },
  { atomicNumber: 77, symbol: "Ir", name: "Iridijum", group: 9, period: 6, category: "prijelazni metal" },
  { atomicNumber: 78, symbol: "Pt", name: "Platina", group: 10, period: 6, category: "prijelazni metal" },
  { atomicNumber: 79, symbol: "Au", name: "Zlato", group: 11, period: 6, category: "prijelazni metal" },
  { atomicNumber: 80, symbol: "Hg", name: "Živa", group: 12, period: 6, category: "post-tranzicioni metal" },
  { atomicNumber: 81, symbol: "Tl", name: "Talijum", group: 13, period: 6, category: "post-tranzicioni metal" },
  { atomicNumber: 82, symbol: "Pb", name: "Olovo", group: 14, period: 6, category: "post-tranzicioni metal" },
  { atomicNumber: 83, symbol: "Bi", name: "Bizmut", group: 15, period: 6, category: "post-tranzicioni metal" },
  { atomicNumber: 84, symbol: "Po", name: "Polonijum", group: 16, period: 6, category: "polumetal" },
  { atomicNumber: 85, symbol: "At", name: "Astat", group: 17, period: 6, category: "halogen" },
  { atomicNumber: 86, symbol: "Rn", name: "Radon", group: 18, period: 6, category: "plemeniti gas" },
  { atomicNumber: 87, symbol: "Fr", name: "Francijum", group: 1, period: 7, category: "alkalni metal" },
  { atomicNumber: 88, symbol: "Ra", name: "Radijum", group: 2, period: 7, category: "alkalnozemni metal" },
  { atomicNumber: 89, symbol: "Ac", name: "Aktinijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 90, symbol: "Th", name: "Torijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 91, symbol: "Pa", name: "Protaktinijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 92, symbol: "U", name: "Uranijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 93, symbol: "Np", name: "Neptunijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 94, symbol: "Pu", name: "Plutonijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 95, symbol: "Am", name: "Americijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 96, symbol: "Cm", name: "Kurijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 97, symbol: "Bk", name: "Berkelijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 98, symbol: "Cf", name: "Kalifornijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 99, symbol: "Es", name: "Einštajnijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 100, symbol: "Fm", name: "Fermijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 101, symbol: "Md", name: "Mendelevijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 102, symbol: "No", name: "Nobelijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 103, symbol: "Lr", name: "Lorensijum", group: 3, period: 7, category: "aktinid" },
  { atomicNumber: 104, symbol: "Rf", name: "Raderfordijum", group: 4, period: 7, category: "prijelazni metal" },
  { atomicNumber: 105, symbol: "Db", name: "Dubnijum", group: 5, period: 7, category: "prijelazni metal" },
  { atomicNumber: 106, symbol: "Sg", name: "Seaborgijum", group: 6, period: 7, category: "prijelazni metal" },
  { atomicNumber: 107, symbol: "Bh", name: "Bohrium", group: 7, period: 7, category: "prijelazni metal" },
  { atomicNumber: 108, symbol: "Hs", name: "Hasijum", group: 8, period: 7, category: "prijelazni metal" },
  { atomicNumber: 109, symbol: "Mt", name: "Meitnerijum", group: 9, period: 7, category: "prijelazni metal" },
  { atomicNumber: 110, symbol: "Ds", name: "Darmshtatijum", group: 10, period: 7, category: "prijelazni metal" },
  { atomicNumber: 111, symbol: "Rg", name: "Rengenijum", group: 11, period: 7, category: "prijelazni metal" },
  { atomicNumber: 112, symbol: "Cn", name: "Kopernicijum", group: 12, period: 7, category: "post-tranzicioni metal" },
  { atomicNumber: 113, symbol: "Nh", name: "Nihonijum", group: 13, period: 7, category: "post-tranzicioni metal" },
  { atomicNumber: 114, symbol: "Fl", name: "Flerovijum", group: 14, period: 7, category: "post-tranzicioni metal" },
  { atomicNumber: 115, symbol: "Mc", name: "Moskovijum", group: 15, period: 7, category: "post-tranzicioni metal" },
  { atomicNumber: 116, symbol: "Lv", name: "Livermorijum", group: 16, period: 7, category: "post-tranzicioni metal" },
  { atomicNumber: 117, symbol: "Ts", name: "Tenesin", group: 17, period: 7, category: "halogen" },
  { atomicNumber: 118, symbol: "Og", name: "Oganeson", group: 18, period: 7, category: "plemeniti gas" },
];

function cellPosition(element: Element) {
  const isLanthanide = element.atomicNumber >= 57 && element.atomicNumber <= 71;
  const isActinide = element.atomicNumber >= 89 && element.atomicNumber <= 103;
  const row = isLanthanide ? 8 : isActinide ? 9 : element.period;
  const col = isLanthanide ? element.atomicNumber - 56 + 2 : isActinide ? element.atomicNumber - 88 + 2 : element.group;
  return { row, col };
}

function elementInfo(element: Element) {
  const defaults = categoryDefaults[element.category];
  return {
    physical: defaults.physical,
    chemical: defaults.chemical,
    reactions: defaults.reactions,
  };
}

export default function HemijaPage() {
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [selectedElement, setSelectedElement] = useState<Element>(ELEMENTS[0]);

  const groupList = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => i + 1).map((g) => ({
        id: g,
        name: groupNames[g],
        characteristics: groupCharacteristics[g],
      })),
    []
  );

  const selectedDetails = useMemo(() => elementInfo(selectedElement), [selectedElement]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-10 space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-primary dark:text-brand-accent font-semibold">
            Hemija 26&apos;
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Maketа periodnog sistema – interaktivno učenje na srpskom
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Klikni na grupu ili element da vidiš karakteristike, fizička i hemijska svojstva i tipične reakcije.
            Podaci su edukativni i ilustrativni (mock) kako bi se brzo orijentisao u trendovima periodnog sistema.
          </p>
        </header>

        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {groupList.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={cn(
                  "px-3 py-2 rounded-xl border text-sm font-semibold transition-all",
                  selectedGroup === group.id
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-primary/50"
                )}
              >
                {group.id}. {group.name}
              </button>
            ))}
          </div>
          <div className="bg-slate-100/70 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-2">
              {selectedGroup}. {groupNames[selectedGroup]}
            </h3>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-200 list-disc list-inside">
              {groupCharacteristics[selectedGroup]?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Periodni sistem (mock)</h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Klikni element za detalje • Duplo dno: lantanidi/aktinidi
              </div>
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(18, minmax(48px, 1fr))" }}
            >
              {ELEMENTS.map((el) => {
                const pos = cellPosition(el);
                const isSelected = selectedElement.atomicNumber === el.atomicNumber;
                return (
                  <button
                    key={el.atomicNumber}
                    onClick={() => setSelectedElement(el)}
                    style={{ gridColumn: pos.col, gridRow: pos.row }}
                    className={cn(
                      "relative aspect-square rounded-lg border text-left p-1 flex flex-col justify-between transition-all duration-150",
                      CATEGORY_COLORS[el.category],
                      isSelected && "ring-2 ring-brand-primary dark:ring-brand-accent scale-[1.02] shadow-md"
                    )}
                  >
                    <span className="text-[11px] font-semibold opacity-80">{el.atomicNumber}</span>
                    <span className="text-lg font-bold leading-none">{el.symbol}</span>
                    <span className="text-[10px] truncate">{el.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex gap-2 items-center">
                <span className="inline-block px-2 py-1 rounded bg-indigo-100 text-indigo-900 dark:bg-indigo-500/30 dark:text-indigo-50 text-[11px]">
                  Lantanidi (red 8)
                </span>
                <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-900 dark:bg-red-500/30 dark:text-red-50 text-[11px]">
                  Aktinidi (red 9)
                </span>
              </div>
              <p>Boje označavaju kategoriju (alkalni, prelazni, nemetali, halogeni, plemeniti gasovi, itd.).</p>
            </div>
          </div>

          <aside className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Z = {selectedElement.atomicNumber}</p>
                <h3 className="text-3xl font-extrabold leading-tight">{selectedElement.symbol}</h3>
                <p className="text-lg font-semibold">{selectedElement.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Grupa {selectedElement.group} · Period {selectedElement.period} · {selectedElement.category}
                </p>
              </div>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold capitalize border",
                  CATEGORY_COLORS[selectedElement.category]
                )}
              >
                {selectedElement.category}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">Fizička svojstva</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 dark:text-slate-200">
                {selectedDetails.physical.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">Hemijska svojstva</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 dark:text-slate-200">
                {selectedDetails.chemical.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">Primeri reakcija</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-slate-700 dark:text-slate-200">
                {selectedDetails.reactions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
