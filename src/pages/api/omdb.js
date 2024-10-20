const url = process.env.NEXT_PUBLIC_OMDB_API_URL;
const key = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export async function searchMovies(query, page = 1, isSearchPage = false) {
  const response = await fetch(`${url}?apikey=${key}&s=${encodeURIComponent(query)}&page=${page}`);
  const data = await response.json();

  const result = {
    movies: [],
    totalResults: 0
  };

  if (data.Search) {
    result.movies = isSearchPage ? data.Search.slice(0, 2) : data.Search;
    result.totalResults = data.totalResults ? parseInt(data.totalResults, 20) : 0;
  }

  return result;
}

export async function getMovieDetails(imdbID) {
  const response = await fetch(`${url}?apikey=${key}&i=${imdbID}`);
  const data = await response.json();
  return data;
}
