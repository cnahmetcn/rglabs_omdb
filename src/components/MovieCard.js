import Image from 'next/image';
import defaultImage from '../assets/img/default.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const [showAllActors, setShowAllActors] = useState(false);
  const [showFullPlot, setShowFullPlot] = useState(false);

  const handleShowAllActors = () => {
    setShowAllActors((prev) => !prev);
  };

  const handleShowFullPlot = () => {
    setShowFullPlot((prev) => !prev);
  };

  const actorsList = movie.Actors && movie.Actors !== "N/A" ? movie.Actors.split(', ') : ['Belirtilmemiş'];
  const rating = movie.Ratings && movie.Ratings.length > 0 ? movie.Ratings[0]['Value'] : null;
  const [score, scale] = rating ? rating.split('/') : ['0', '10'];

  return (
    <div className="flex flex-col md:flex-row p-4 max-w-full mx-auto overflow-hidden">
      <Image
        width={200}
        height={300}
        src={movie.Poster !== "N/A" ? movie.Poster : defaultImage}
        alt={movie.Title}
        className="h-80 w-auto object-cover mb-4 md:mb-0 md:mr-6"
      />
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold">{movie.Title} ({movie.Year})</h2>
          <div className="flex items-center mb-2">
            <FontAwesomeIcon className="text-blue-500" icon={faStar} />
            <span className="ml-2 text-2xl text-blue-500 font-bold">{score}</span>
            <span className="ml-1 text-gray-600 text-sm">/{scale}</span>
          </div>
          <p className="text-md text-gray-600 mb-2">
            Dil: {movie.Language === 'N/A' ? 'Bilinmiyor' : movie.Language}
            <br />
            Oyuncular: 
            {showAllActors ? actorsList.join(', ') : actorsList.slice(0, 2).join(', ')}
            {
              actorsList.length > 2 && 
              <span className="cursor-pointer underline" onClick={handleShowAllActors}>
                {showAllActors ? ' << Gizle' : ' Tüm Listeyi Gör >>'}
              </span>
            }
          </p>
        </div>
        <p className="text-md text-gray-600">
          {showFullPlot 
            ? movie.Plot 
            : movie.Plot.length > 150 
              ? `${movie.Plot.slice(0, 150)}... ` 
              : 'Belirtilmemiş'}
          {movie.Plot.length > 150 && 
            <span className="cursor-pointe underline" onClick={handleShowFullPlot}>
              {showFullPlot ? ' << Gizle' : ' Detaylar >>'}
            </span>}
        </p>
      </div>
    </div>
  );
}
