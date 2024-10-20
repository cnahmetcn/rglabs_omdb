import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { searchMovies, getMovieDetails } from './api/omdb';
import MovieCard from '../components/MovieCard'; 
import Link from 'next/link';
import Head from 'next/head';

export default function Results() {
  const router = useRouter();
  const { search } = router.query;
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search) {
      setMovies([]);
      setPage(1);
      setHasMore(true);
      fetchMovies(search, 1, true);
    }
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const fetchMovies = async (query, pageNum, reset = false) => {
    setLoading(true);
    const result = await searchMovies(query, pageNum);

    const detailedMovies = await Promise.all(
      result.movies.map(async (movie) => {
        const movieDetails = await getMovieDetails(movie.imdbID);
        return movieDetails;
      })
    );

    setMovies((prevMovies) =>
      reset ? detailedMovies : [...prevMovies, ...detailedMovies]
    );
    setTotalResults(result.totalResults);
    setHasMore(movies.length + detailedMovies.length < result.totalResults);
    setLoading(false);
  };

  useEffect(() => {
    if (page > 1) {
      fetchMovies(search, page);
    }
  }, [page]);

  return (
    <>
    <Head>
        <title>{search} için Sonuçlar</title>
      </Head> 
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-screen-xl bg-white p-8 rounded-lg shadow-lg">
      <div className="px-0 sm:px-72 md:px-48 mb-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
        <h1 className="text-blue-500 text-2xl font-semibold text-center">
          {search} için Sonuçlar
        </h1>
        <p className="text-gray-500 hidden sm:block text-center">
            {totalResults} sonuç bulundu
          </p>
          <p className="text-gray-500 sm:hidden text-center">
            ({totalResults})
          </p>
      </div>
    </div>
          <div className="grid grid-cols-2 gap-6 divide-y">
            {movies.map((movie, index) => (
              <div key={index} className="flex flex-col sm:flex-row justify-between items-stretch">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

        {loading && <p className="text-center">Yükleniyor...</p>}
        <hr className="my-6 border-gray-300" />
        <div className="text-center">
          <Link href="/" className="text-blue-500 underline">
            BAŞA DÖN
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
