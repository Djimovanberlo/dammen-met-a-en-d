import "./App.css";
import { useState } from "react";

const BORD_GROOTTE = 10;
const KLEUR_GEEL = "#fff5c4";
const KLEUR_PAARS = "#C547FF";
const KLEUR_ZWART = "#000000";
const KLEUR_WIT = "#ffffff";

const RICHTINGEN = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function maakTegelKleur(rij, kolom) {
  const isZwart = (rij + kolom) % 2 === 1;
  const achtergrondKleur = isZwart ? KLEUR_ZWART : KLEUR_WIT;
  return achtergrondKleur;
}

function maakStartStuk(rij, kolom) {
  const tegelIsZwart = (rij + kolom) % 2 === 1;
  if (tegelIsZwart && rij < 4) {
    return { kleur: KLEUR_PAARS, isDam: false };
  } else if (tegelIsZwart && rij > 5) {
    return { kleur: KLEUR_GEEL, isDam: false };
  } else {
    return null;
  }
}

function maakStartBord() {
  return new Array(BORD_GROOTTE).fill(null).map((_, rij) => {
    return new Array(BORD_GROOTTE).fill(null).map((_, kolom) => {
      const tegel = {
        achtergrondKleur: maakTegelKleur(rij, kolom),
        stuk: maakStartStuk(rij, kolom),
      };

      return tegel;
    });
  });
}

function andereSpeler(kleur) {
  return kleur === KLEUR_GEEL ? KLEUR_PAARS : KLEUR_GEEL;
}

// Gele stukken lopen omhoog (rij wordt kleiner), paarse omlaag
function voorwaartsRichting(kleur) {
  return kleur === KLEUR_GEEL ? -1 : 1;
}

function laatsteRij(kleur) {
  return kleur === KLEUR_GEEL ? 0 : BORD_GROOTTE - 1;
}

function stukkenVan(bord, kleur) {
  const stukken = [];
  bord.forEach((r, rij) => {
    r.forEach((vak, kolom) => {
      if (vak.stuk?.kleur === kleur) {
        stukken.push({ rij, kolom });
      }
    });
  });
  return stukken;
}

// Gewone zetten: een steen 1 stap vooruit, een dam zo ver als hij wil
function zoekStappen(bord, rij, kolom) {
  const stuk = bord[rij][kolom].stuk;
  const stappen = [];

  for (const [dRij, dKolom] of RICHTINGEN) {
    if (!stuk.isDam && dRij !== voorwaartsRichting(stuk.kleur)) {
      continue;
    }

    let r = rij + dRij;
    let k = kolom + dKolom;
    while (bord[r]?.[k] && !bord[r][k].stuk) {
      stappen.push({ rij: r, kolom: k });
      if (!stuk.isDam) {
        break;
      }
      r += dRij;
      k += dKolom;
    }
  }

  return stappen;
}

// Slagen: over een stuk van de tegenstander naar een leeg vak erachter,
// in alle 4 richtingen (dus ook achteruit)
function zoekSlagen(bord, rij, kolom) {
  const stuk = bord[rij][kolom].stuk;
  const slagen = [];

  for (const [dRij, dKolom] of RICHTINGEN) {
    let r = rij + dRij;
    let k = kolom + dKolom;

    if (stuk.isDam) {
      while (bord[r]?.[k] && !bord[r][k].stuk) {
        r += dRij;
        k += dKolom;
      }
    }

    const tussenStuk = bord[r]?.[k]?.stuk;
    if (!tussenStuk || tussenStuk.kleur === stuk.kleur) {
      continue;
    }

    let landRij = r + dRij;
    let landKolom = k + dKolom;
    while (bord[landRij]?.[landKolom] && !bord[landRij][landKolom].stuk) {
      slagen.push({ rij: landRij, kolom: landKolom });
      if (!stuk.isDam) {
        break;
      }
      landRij += dRij;
      landKolom += dKolom;
    }
  }

  return slagen;
}

function heeftSlag(bord, stukken) {
  return stukken.some(({ rij, kolom }) => zoekSlagen(bord, rij, kolom).length > 0);
}

function zoekGeslagenStuk(bord, vanRij, vanKolom, naarRij, naarKolom) {
  const dRij = Math.sign(naarRij - vanRij);
  const dKolom = Math.sign(naarKolom - vanKolom);

  let r = vanRij + dRij;
  let k = vanKolom + dKolom;
  while (r !== naarRij) {
    if (bord[r][k].stuk) {
      return { rij: r, kolom: k };
    }
    r += dRij;
    k += dKolom;
  }

  return null;
}

function App() {
  const [bord, setBord] = useState(maakStartBord);
  const [spelerAandeBeurt, setSpelerAanDeBeurt] = useState(KLEUR_GEEL);
  const [geselecteerdStuk, setGeselecteerdStuk] = useState(null);
  const [geslagenPaarseStukken, setGeslagenPaarseStukken] = useState(0);
  const [geslagenGeleStukken, setGeslagenGeleStukken] = useState(0);
  // Na een slag moet hetzelfde stuk doorslaan zolang dat kan
  const [middenInSlag, setMiddenInSlag] = useState(false);

  const eigenStukken = stukkenVan(bord, spelerAandeBeurt);
  const moetSlaan = middenInSlag || heeftSlag(bord, eigenStukken);
  const kanBewegen =
    moetSlaan ||
    eigenStukken.some(
      ({ rij, kolom }) => zoekStappen(bord, rij, kolom).length > 0
    );
  const winnaar = kanBewegen ? null : andereSpeler(spelerAandeBeurt);

  const doelen = geselecteerdStuk
    ? (moetSlaan ? zoekSlagen : zoekStappen)(
        bord,
        geselecteerdStuk.rijIndex,
        geselecteerdStuk.tegelIndex
      )
    : [];
  const isDoel = (rij, kolom) =>
    doelen.some((doel) => doel.rij === rij && doel.kolom === kolom);

  const klikOpEenStuk = (kleur, rijIndex, tegelIndex) => {
    if (winnaar || middenInSlag || kleur !== spelerAandeBeurt) {
      return;
    }

    setGeselecteerdStuk({ rijIndex, tegelIndex });
  };

  const klikOpEenTegel = (doelRij, doelTegel) => {
    if (winnaar || !geselecteerdStuk || !isDoel(doelRij, doelTegel)) {
      return;
    }

    const { rijIndex: selectieRij, tegelIndex: selectieTegel } =
      geselecteerdStuk;

    const nieuweBord = bord.map((r) => r.map((v) => ({ ...v })));
    const stuk = nieuweBord[selectieRij][selectieTegel].stuk;
    const geslagen = zoekGeslagenStuk(
      bord,
      selectieRij,
      selectieTegel,
      doelRij,
      doelTegel
    );

    nieuweBord[selectieRij][selectieTegel].stuk = null;
    nieuweBord[doelRij][doelTegel].stuk = stuk;

    if (geslagen) {
      nieuweBord[geslagen.rij][geslagen.kolom].stuk = null;

      if (spelerAandeBeurt === KLEUR_GEEL) {
        setGeslagenPaarseStukken((s) => s + 1);
      } else {
        setGeslagenGeleStukken((s) => s + 1);
      }

      if (zoekSlagen(nieuweBord, doelRij, doelTegel).length > 0) {
        setBord(nieuweBord);
        setGeselecteerdStuk({ rijIndex: doelRij, tegelIndex: doelTegel });
        setMiddenInSlag(true);
        return;
      }
    }

    // Een steen wordt pas dam als zijn beurt daar eindigt
    if (doelRij === laatsteRij(stuk.kleur)) {
      nieuweBord[doelRij][doelTegel].stuk = { ...stuk, isDam: true };
    }

    setBord(nieuweBord);
    setGeselecteerdStuk(null);
    setMiddenInSlag(false);
    setSpelerAanDeBeurt(andereSpeler(spelerAandeBeurt));
  };

  return (
    <div className="App">
      <h2>Aki programmeert</h2>
      <p>
        {winnaar
          ? `Gewonnen: ${winnaar === KLEUR_GEEL ? "geel" : "paars"}`
          : `Aan de beurt: ${spelerAandeBeurt === KLEUR_GEEL ? "geel" : "paars"}`}
      </p>
      <div style={{ display: "flex", gap: 150 }}>
        <div
          style={{
            width: "fit-content",
            display: "grid",
            border: "10px solid LightSalmon",
            gridTemplateColumns: `repeat(${BORD_GROOTTE}, 1fr)`,
            gridTemplateRows: `repeat(${BORD_GROOTTE}, 1fr)`,
          }}
        >
          {bord.map((rij, rijIndex) => {
            return rij.map((tegel, tegelIndex) => {
              return (
                <div
                  key={`${rijIndex}-${tegelIndex}`}
                  onClick={() => klikOpEenTegel(rijIndex, tegelIndex)}
                  style={{
                    display: "grid",
                    position: "relative",
                    placeContent: "center",
                    backgroundColor: isDoel(rijIndex, tegelIndex)
                      ? "blue"
                      : tegel.achtergrondKleur,
                    height: 50,
                    width: 50,
                    fontSize: "24px",
                  }}
                >
                  {tegel.stuk?.kleur && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        klikOpEenStuk(tegel.stuk.kleur, rijIndex, tegelIndex);
                      }}
                      style={{
                        backgroundColor: tegel.stuk.kleur,
                        boxSizing: "border-box",
                        // Een dam herken je aan de teal rand (zelfde als de tellers)
                        border: tegel.stuk.isDam ? "5px solid teal" : undefined,
                        height: 30,
                        width: 30,
                        borderRadius: "100%",
                      }}
                    />
                  )}
                </div>
              );
            });
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "50px 0",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            Geslagen stukken:
            <div
              style={{
                height: 50,
                width: 50,
                backgroundColor: KLEUR_GEEL,
                border: "5px solid teal",
                display: "grid",
                placeItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 30,
                }}
              >
                {geslagenGeleStukken}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            Geslagen stukken:
            <div
              style={{
                height: 50,
                width: 50,
                backgroundColor: KLEUR_PAARS,
                border: "5px solid teal",
                display: "grid",
                placeItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 30,
                }}
              >
                {geslagenPaarseStukken}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
