export default function Cube(props) {
  const colors = {
    null: "rgba(0,0,0,.1)",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };

  return (
    <div className="cube" style={{ background: colors[props.inner] }}>
      {props.inner}
    </div>
  );
}
