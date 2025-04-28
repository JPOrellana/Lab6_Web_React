/* Memory Game*/

const icons = [
  "🍕", "🍔", "🍟", "🌭",
  "🍿", "🥐", "🍩", "🥞"
]; // 8 parejas → 16 tarjetas (4×4)

/*utilidades*/
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/*Componente Tarjeta*/
function Card({ value, index, isFlipped, onClick }) {
  const cardRef = React.useRef(null);

  React.useEffect(() => {
    anime({
      targets: cardRef.current,
      rotateY: isFlipped ? 180 : 0,
      duration: 600,
      easing: "easeInOutQuad"
    });
  }, [isFlipped]);

  return (
    <div
      ref={cardRef}
      className={"card" + (isFlipped ? " flipped" : "")}
      onClick={() => onClick(index)}
    >
      <div className="face back">{value}</div>    
      <div className="face front"></div>          
    </div>
  );
}

/*Componente principal*/
function MemoryGame() {
  const [cards, setCards] = React.useState(() => shuffle([...icons, ...icons]));
  const [flipped, setFlipped] = React.useState([]);
  const [matched, setMatched] = React.useState([]);
  const [moves, setMoves] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  /* manejar clic en tarjeta */
  const handleClick = idx => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx))
      return;
    setFlipped([...flipped, idx]);
  };

  /* lógica de comparación */
  React.useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1);
      const [i, j] = flipped;
      if (cards[i] === cards[j]) {
        setMatched(m => [...m, i, j]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }, [flipped]);

  /* detectar fin de juego */
  React.useEffect(() => {
    if (matched.length === cards.length) {
      setFinished(true);
    }
  }, [matched]);

  /* reiniciar */
  const restartGame = () => {
    setCards(shuffle([...icons, ...icons]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setFinished(false);
  };

  return (
    <div>
      <div id="game">
        {cards.map((val, idx) => (
          <Card
            key={idx}
            value={val}
            index={idx}
            isFlipped={flipped.includes(idx) || matched.includes(idx)}
            onClick={handleClick}
          />
        ))}
      </div>

      <div id="stats">Movimientos: {moves}</div>

      {finished && (
        <>
          <div id="message">🎉 ¡Juego completado! 🎉</div>
          <button className="restart" onClick={restartGame}>
            Reiniciar
          </button>
        </>
      )}
    </div>
  );
}

/*Renderizado*/
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MemoryGame />);
