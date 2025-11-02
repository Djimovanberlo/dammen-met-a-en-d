import "./App.css";
import { useState } from "react";

// 1 - variabelen (declaratie & toewijzing)
//    - dubbel
//    - naam, kleur / achtergrondkleur, leeftijd, lekker / vies eten, favoriete groente
// 2 - variabelen typen (number, string, boolean, null/undefined)
//  - typeof (waarom typeof?)
// 3 - operatoren + - * / %
// 4 - if ... else ... else
// 5 - object / array
//    - toewijzing, waarde
// 6 - loops
// 7 - functies
// 8 - reeks zwart-wit

var string = "dit is een string";
var number = 123;
var boolean = true;
var niks = null;

/// --- COMPLEXE VARIABELEN --- ///
// 1 - object
// 2 - array

const BORD_GROOTTE = 10;

const KLEUR_GEEL = "#fff5c4";
const KLEUR_PAARS = "#390088";
const KLEUR_ZWART = "#000000";
const KLEUR_WIT = "#ffffff";

function maakStartstukken() {
  console.log("P");
  return new Array(BORD_GROOTTE).fill(null).map((_, rij) =>
    new Array(BORD_GROOTTE).fill(null).map((_, kolom) => {
      const isZwart = (rij + kolom) % 2 === 1;

      if (isZwart && rij < 4) {
        return { kleur: KLEUR_PAARS };
      } else if (isZwart && rij > 5) {
        return { kleur: KLEUR_GEEL };
      } else {
        return null;
      }
    })
  );
}

function App() {
  const [stukken, setStukken] = useState(maakStartstukken());

  const clickOpDeKnop = (kleur, rij, kolom) => {
    setStukken((vorigeStukken) => {
      const nieuweStukken = vorigeStukken.map((r, rIndex) =>
        r.map((vak, kIndex) => {
          if (kleur === KLEUR_GEEL) {
            // Kopieer standaard het originele vak
            if (rIndex === rij && kIndex === kolom) {
              return null; // verwijder het stuk van de originele plek
            } else if (rIndex === rij - 1 && kIndex === kolom - 1) {
              return vorigeStukken[rij][kolom]; // verplaats het stuk naar rechts
            } else {
              return vak; // alle andere vakjes blijven hetzelfde
            }
          } else if (kleur === KLEUR_PAARS) {
            if (rIndex === rij && kIndex === kolom) {
              return null; // verwijder het stuk van de originele plek
            } else if (rIndex === rij + 1 && kIndex === kolom + 1) {
              return vorigeStukken[rij][kolom]; // verplaats het stuk naar rechts
            } else {
              return vak; // alle andere vakjes blijven hetzelfde
            }
          } else {
            return vak;
          }
        })
      );

      return nieuweStukken;
    });
  };

  const bord = new Array(BORD_GROOTTE).fill(null).map((_, rij) => {
    return new Array(BORD_GROOTTE).fill(null).map((_, kolom) => {
      const isZwart = (rij + kolom) % 2 === 1;
      const achtergrondKleur = isZwart ? KLEUR_ZWART : KLEUR_WIT;
      const stuk = stukken[rij][kolom] ?? null;

      return (
        <div
          key={`${rij}-${kolom}`}
          style={{
            display: "grid",
            placeContent: "center",
            backgroundColor: achtergrondKleur,
            height: 50,
            width: 50,
            fontSize: "24px",
          }}
        >
          {stuk?.kleur && (
            <div
              onClick={() => clickOpDeKnop(stuk.kleur, rij, kolom)}
              style={{
                height: 30,
                width: 30,
                borderRadius: "100%",
                backgroundColor: stuk.kleur,
              }}
            />
          )}
        </div>
      );
    });
  });

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
        {bord.flat()}
      </div>
    </div>
  );
}

export default App;
