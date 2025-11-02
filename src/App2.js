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
      };

      return tegel;
    });
  });
}

function App() {
  const [bord, setBord] = useState(maakStartBord());
  const [spelerAandeBeurt, setSpelerAanDeBeurt] = useState(KLEUR_GEEL);
  const [geselecteerdStuk, setGeselecteerdStuk] = useState(null);

  function schakelSpeler() {
    setSpelerAanDeBeurt((huidigeSpeler) => {
      if (huidigeSpeler === KLEUR_GEEL) {
        return KLEUR_PAARS;
      } else {
        return KLEUR_GEEL;
      }
    });
  }

  const klikOpEenStuk = (kleur, rijIndex, tegelIndex) => {
    if (kleur !== spelerAandeBeurt) {
      return;
    }

    setGeselecteerdStuk({ kleur, rijIndex, tegelIndex });

    setBord((vorigeBord) => {
      const nieuweBord = vorigeBord.map((r, rIndex) => {
        return r.map((vak, vIndex) => {
          if (kleur === KLEUR_GEEL) {
            const linksBoven = vorigeBord[rijIndex - 1][tegelIndex - 1];
            const rechtsBoven = vorigeBord[rijIndex - 1][tegelIndex + 1];
            const achterLinksBoven = vorigeBord[rijIndex - 2][tegelIndex - 2];
            const achterRechtsBoven = vorigeBord[rijIndex - 2][tegelIndex + 2];

            vak.klikbaar = false;

            if (linksBoven && !linksBoven.stuk) {
              linksBoven.klikbaar = true;
            }

            if (
              linksBoven &&
              linksBoven.stuk &&
              achterLinksBoven &&
              !achterLinksBoven.stuk
            ) {
              achterLinksBoven.klikbaar = true;
            }

            if (rechtsBoven && !rechtsBoven.stuk) {
              rechtsBoven.klikbaar = true;
            }

            if (
              rechtsBoven &&
              rechtsBoven.stuk &&
              achterRechtsBoven &&
              !achterRechtsBoven.stuk
            ) {
              achterRechtsBoven.klikbaar = true;
            }

            return vak;
          } else if (kleur === KLEUR_PAARS) {
            const linksOnder = vorigeBord[rijIndex + 1][tegelIndex - 1];
            const rechtsOnder = vorigeBord[rijIndex + 1][tegelIndex + 1];
            const achterLinksOnder = vorigeBord[rijIndex + 2][tegelIndex - 2];
            const achterRechtsOnder = vorigeBord[rijIndex + 2][tegelIndex + 2];

            vak.klikbaar = false;

            if (linksOnder && !linksOnder.stuk) {
              linksOnder.klikbaar = true;
            }

            if (
              linksOnder &&
              linksOnder.stuk &&
              achterLinksOnder &&
              !achterLinksOnder.stuk
            ) {
              achterLinksOnder.klikbaar = true;
            }

            if (rechtsOnder && !rechtsOnder.stuk) {
              rechtsOnder.klikbaar = true;
            }

            if (
              rechtsOnder &&
              rechtsOnder.stuk &&
              achterRechtsOnder &&
              !achterRechtsOnder.stuk
            ) {
              achterRechtsOnder.klikbaar = true;
            }

            return vak;
          }
        });
      });

      return nieuweBord;
    });
  };

  const klikOpEenTegel = (rijIndex, tegelIndex) => {
    const geklikteTegel = bord[rijIndex][tegelIndex];

    if (!geselecteerdStuk || !geklikteTegel.klikbaar) {
      return;
    }

    setBord((vorigeBord) => {
      const nieuweBord = [...vorigeBord].map((r) =>
        [...r].map((v) => ({ ...v }))
      );

      const { rijIndex: sRij, tegelIndex: sTegel } = geselecteerdStuk;
      const geselecteerdVak = nieuweBord[sRij][sTegel];
      const doelVak = nieuweBord[rijIndex][tegelIndex];

      // Geen beweging als er al een stuk staat
      if (doelVak.stuk) {
        return nieuweBord;
      }

      const rDelta = rijIndex - sRij;
      const kDelta = tegelIndex - sTegel;

      // 1 stap diagonaal (gewoon bewegen)
      if (Math.abs(rDelta) === 1 && Math.abs(kDelta) === 1) {
        doelVak.stuk = geselecteerdVak.stuk;
        geselecteerdVak.stuk = null;
      }

      // 2 stappen diagonaal (slaan)
      else if (Math.abs(rDelta) === 2 && Math.abs(kDelta) === 2) {
        const tussenRij = sRij + rDelta / 2;
        const tussenKolom = sTegel + kDelta / 2;
        const tussenVak = nieuweBord[tussenRij][tussenKolom];

        if (tussenVak.stuk) {
          // verwijder geslagen stuk
          tussenVak.stuk = null;

          // verplaats geselecteerd stuk
          doelVak.stuk = geselecteerdVak.stuk;
          geselecteerdVak.stuk = null;
        }
      }

      doelVak.klikbaar = false;
      return nieuweBord;
    });

    klikOpEenStuk(geselecteerdStuk.kleur, rijIndex, tegelIndex);
    schakelSpeler();

    // setGeselecteerdStuk({
    //   kleur: geselecteerdStuk.kleur,
    //   rijIndex,
    //   tegelIndex,
    // });
  };

  return (
    <div className="App">
      <h2>Aki programmeert</h2>
      <p>Aan de beurt: {spelerAandeBeurt === KLEUR_GEEL ? "geel" : "paars"}</p>
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
                  backgroundColor: tegel.klikbaar
                    ? "blue"
                    : tegel.achtergrondKleur,
                  height: 50,
                  width: 50,
                  fontSize: "24px",
                }}
              >
                {/* <div
                  style={{
                    color: "red",
                    position: "absolute",
                    fontSize: "0.7rem",
                    top: "50%",
                    left: 5,
                    transform: "translateY(-50%)",
                  }}
                >
                  r:{rijIndex} t:{tegelIndex}
                </div> */}
                {tegel.stuk?.kleur && (
                  <div
                    onClick={() =>
                      klikOpEenStuk(tegel.stuk.kleur, rijIndex, tegelIndex)
                    }
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
