import "./App.css";
import { useEffect, useState } from "react";

const BORD_GROOTTE = 10;
const KLEUR_GEEL = "#fff5c4";
const KLEUR_PAARS = "#C547FF";
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
        klikbaar: false,
      };

      return tegel;
    });
  });
}

function App() {
  const [bord, setBord] = useState(maakStartBord());
  const [spelerAandeBeurt, setSpelerAanDeBeurt] = useState(KLEUR_GEEL);
  const [geselecteerdStuk, setGeselecteerdStuk] = useState(null);
  const [geslagenPaarseStukken, setGeslagenPaarseStukken] = useState(0);
  const [geslagenGeleStukken, setGeslagenGeleStukken] = useState(0);
  // nov
  const [spelerHeeftBewogen, setSpelerHeeftBewogen] = useState(false);
  useEffect(() => {
    const heeftKlikbareTegels = bord.some((r) => r.some((t) => t.klikbaar));

    if (!heeftKlikbareTegels && spelerHeeftBewogen) {
      schakelSpeler();
      setSpelerHeeftBewogen(false);
    }
  }, [bord, spelerHeeftBewogen]);
  //nov

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
            const linksBoven = vorigeBord[rijIndex - 1]?.[tegelIndex - 1];
            const rechtsBoven = vorigeBord[rijIndex - 1]?.[tegelIndex + 1];
            const achterLinksBoven = vorigeBord[rijIndex - 2]?.[tegelIndex - 2];
            const achterRechtsBoven =
              vorigeBord[rijIndex - 2]?.[tegelIndex + 2];

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
            const linksOnder = vorigeBord[rijIndex + 1]?.[tegelIndex - 1];
            const rechtsOnder = vorigeBord[rijIndex + 1]?.[tegelIndex + 1];
            const achterLinksOnder = vorigeBord[rijIndex + 2]?.[tegelIndex - 2];
            const achterRechtsOnder =
              vorigeBord[rijIndex + 2]?.[tegelIndex + 2];

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

  const klikOpEenTegel = (doelRij, doelTegel) => {
    const geklikteTegel = bord[doelRij][doelTegel];

    if (!geselecteerdStuk || !geklikteTegel.klikbaar) {
      return;
    }

    const { rijIndex: selectieRij, tegelIndex: selectieTegel } =
      geselecteerdStuk;

    const rDelta = doelRij - selectieRij;
    const tDelta = doelTegel - selectieTegel;

    const isEenStapDiagonaal = Math.abs(rDelta) === 1 && Math.abs(tDelta) === 1;
    const isTweeStappenDiagonaal =
      Math.abs(rDelta) === 2 && Math.abs(tDelta) === 2;

    setBord((vorigeBord) => {
      const nieuweBord = [...vorigeBord].map((r) =>
        [...r].map((v) => ({ ...v }))
      );

      const geselecteerdVak = nieuweBord[selectieRij][selectieTegel];
      const doelVak = nieuweBord[doelRij][doelTegel];

      // Geen beweging als er al een stuk staat
      if (doelVak.stuk) {
        return nieuweBord;
      }

      // 1 stap diagonaal (gewoon bewegen)
      if (isEenStapDiagonaal) {
        doelVak.stuk = geselecteerdVak.stuk;
        geselecteerdVak.stuk = null;
        // nov
        nieuweBord.forEach((r) => {
          r.forEach((v) => {
            v.klikbaar = false;
          });
        });
        // nov
      }

      // 2 stappen diagonaal (slaan)
      else if (isTweeStappenDiagonaal) {
        const tussenRij = selectieRij + rDelta / 2;
        const tussenKolom = selectieTegel + tDelta / 2;
        const tussenVak = nieuweBord[tussenRij][tussenKolom];

        if (tussenVak.stuk) {
          // verwijder geslagen stuk
          tussenVak.stuk = null;

          if (spelerAandeBeurt === KLEUR_GEEL) {
            setGeslagenPaarseStukken((s) => s + 1);
          } else {
            setGeslagenGeleStukken((s) => s + 1);
          }

          // verplaats geselecteerd stuk
          doelVak.stuk = geselecteerdVak.stuk;
          geselecteerdVak.stuk = null;
        }
      }

      doelVak.klikbaar = false;
      return nieuweBord;
    });
    // nov

    setSpelerHeeftBewogen(true);

    if (isTweeStappenDiagonaal) {
      klikOpEenStuk(geselecteerdStuk.kleur, doelRij, doelTegel);
    }
    // nov
  };

  return (
    <div className="App">
      <h2>Aki programmeert</h2>
      <p>Aan de beurt: {spelerAandeBeurt === KLEUR_GEEL ? "geel" : "paars"}</p>
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
                    backgroundColor: tegel.klikbaar
                      ? "blue"
                      : tegel.achtergrondKleur,
                    height: 50,
                    width: 50,
                    fontSize: "24px",
                  }}
                >
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
