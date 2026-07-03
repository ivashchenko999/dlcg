export interface Game {
  id: number;
  title: string;
  developer: string;
  /** ISO date, e.g. "2015-05-19". */
  releaseDate: string;
  price: number;
  genreId: number;
  genreName: string;
}

export interface Genre {
  id: number;
  name: string;
}

/** Payload for creating or updating a game. */
export interface SaveGameRequest {
  title: string;
  developer: string;
  releaseDate: string;
  price: number;
  genreId: number;
}
