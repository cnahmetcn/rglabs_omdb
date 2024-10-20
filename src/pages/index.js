import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { searchMovies, getMovieDetails } from './api/omdb';
import MovieCard from '../components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.length > 2) {
      setLoading(true);

      const result = await searchMovies(e.target.value, 1, true);
      const detailedMovies = await Promise.all(
        result.movies.map(async (movie) => {
          const movieDetails = await getMovieDetails(movie.imdbID);
          return movieDetails;
        })
      );

      setMovies(detailedMovies);
      setLoading(false);
    } else {
      setMovies([]); // Arama terimi yoksa film listesini temizle
    }
  };

  return (
    <>
      <Head>
        <title>Film Ara</title>
      </Head> 
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className={`relative w-full max-w-2xl transition-all duration-500 ${movies.length > 0 ? 'mt-4' : 'mt-24'}`}>
        <input
          type="text"
          className="w-full py-4 pl-4 pr-12 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Bulmak istediğiniz filmin adını yazınız"
          value={searchTerm}
          onChange={handleSearch}
          style={{ transition: 'transform 0.3s ease' }}
        />
        <div className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500">
          {searchTerm.length > 0 
            ? <FontAwesomeIcon icon={faArrowRight}/> 
            : <FontAwesomeIcon icon={faMagnifyingGlass}/>
          }
        </div>
      </div>

      {loading && <p className="mt-4">Yükleniyor...</p>}

      {searchTerm.length > 2 && (
        <div className={`bg-white p-6 mt-6 w-full max-w-2xl rounded-lg shadow-md`}>
          <div className={`flex flex-col space-y-6 divide-y`}>
            {movies.map((movie, index) => (
              <div key={index}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {movies.length > 0 && (
            <div className="divide-y border-t border-gray-300 mt-6 pt-4 text-center">
              <Link href={`/results?search=${searchTerm}`} className="text-blue-500">
                DAHA FAZLA SONUÇ »
              </Link>
            </div>
          )}

          {movies.length === 0 && !loading && (
            <p className="mt-4 text-center">Sonuç bulunamadı</p>
          )}
        </div>
      )}
    </div>
    </>
  );
}
