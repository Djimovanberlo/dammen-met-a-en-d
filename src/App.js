import "./App.css";

// 1 - variabelen (declaration & assignment)
//    - dubbel
//    - naam, kleur / achtergrondkleur, leeftijd, lekker / vies eten, favoriete groente
// 2 - variabelen typen (number, string, boolean, null/undefined)
//  - typeof (waarom typeof?)
// 3 - operators + - * / %
// 4 - if ... else ... else
// 5 - object / array
//    - assignment, value
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

function App() {
  /*
   * ↓ Voor Aki: Hier onder doen we het programmeren *
   */

  var aantal_vakjes = 8;

  var bord = new Array(aantal_vakjes).fill(null).map((_, index1) => {
    return new Array(aantal_vakjes).fill(null).map((_, index2) => {
      var even_of_oneven = (index1 + index2) % 2;
      var kleur;

      if (even_of_oneven === 1) {
        kleur = "black";
      } else {
        kleur = "white";
      }

      return (
        <div
          style={{
            backgroundColor: kleur,
            height: 50,
            width: 50,
          }}
        />
      );
    });
  });

  /*
   * ↓ Voor Aki: Wat hier onder staat, zien we op het scherm *
   */
  return (
    <div className="App">
      <h2>Aki programmeert</h2>
      <div
        style={{
          width: "fit-content",
          display: "grid",
          border: "10px solid LightSalmon",
          gridTemplateColumns: `repeat(${aantal_vakjes}, 1fr)`,
          gridTemplateRows: `repeat(${aantal_vakjes}, 1fr)`,
        }}
      >
        {bord}
      </div>
    </div>
  );
}

export default App;
