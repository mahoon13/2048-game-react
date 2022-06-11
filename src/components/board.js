import Cube from "./cube";

export default function Board(props) {
  return (
    <>
      <h2>Score: {props.score}</h2>
      <h2>BestScore: {props.bestScore}</h2>
      <div className="board">
        {props.cubes.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cube, lineIndex) => {
              return <Cube inner={cube} key={rowIndex * 4 + lineIndex} />;
            })}
          </div>
        ))}
      </div>
    </>
  );
}
