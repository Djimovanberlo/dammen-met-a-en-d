import "./App.css";
import { useState } from "react";

const BORD_GROOTTE = 10;
const KLEUR_GEEL = "#fff5c4";
const KLEUR_PAARS = "#390088";
const KLEUR_ZWART = "#000000";
const KLEUR_WIT = "#ffffff";

function maakTegelKleur(rij, kolom) {
  const isZwart = (rij + kolom) % 2 === 1;
  const achtergrondKleur = isZwart ? KLEUR_ZWART : KLEUR_WIT;
  return achtergrondKleur;
}

function maakStartStuk(rij, kolom) {
  const tegelIsZwart = (rij + kolom) % 2 === 1;
  if (tegelIsZwart && rij < 4) {
    return { kleur: KLEUR_PAARS };
  } else if (tegelIsZwart && rij > 5) {
    return { kleur: KLEUR_GEEL };
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
        stukKanHierSpringen: false,
      };

      return tegel;
    });
  });
}

function App() {
  const [bord, setBord] = useState(maakStartBord());

  const clickOpDeKnop = (kleur, rij, kolom) => {};

  return (
    <div className="App">
      <h2>Aki programmeert</h2>
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
                style={{
                  display: "grid",
                  placeContent: "center",
                  backgroundColor: tegel.achtergrondKleur,
                  height: 50,
                  width: 50,
                  fontSize: "24px",
                }}
              >
                {tegel.stuk?.kleur && (
                  <div
                    style={{
                      backgroundColor: tegel.stuk.kleur,
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
    </div>
  );
}

export default App;
