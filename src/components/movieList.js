import Movie from "./movie";

export default function Movielist(props) {
  if (!props.movieList) return;

  return (
    <ul className="movie__list">
      {props.movieList.map((movie) => (
        <li className="movie__card">
          <Movie movie={movie} />
        </li>
      ))}
    </ul>
  );
}
