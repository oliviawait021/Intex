import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './MoviesPage.css';
import WelcomeBand from '../components/WelcomeBand';

const genres = [
  'Movie',
  'TV Show',
  'Children',
  'Action',
  'Adventure',
  'Comedies',
  'Documentaries',
  'Docuseries',
  'Dramas',
  'Fantasy',
  'Musicals',
  'Spirituality',
  'Thrillers',
];

interface Movie {
  showId: string;
  title: string;
  imageFileName: string;
}

const MoviesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moviesByGenre, setMoviesByGenre] = useState<Record<string, Movie[]>>(
    {}
  );
  const movieContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    genres.forEach(async (genre) => {
      try {
        const response = await axios.get(
          `https://localhost:port/Movie/GetMoviesByGenre?genre=${genre}`
        );
        setMoviesByGenre((prev) => ({ ...prev, [genre]: response.data }));
      } catch (error) {
        console.error(`Error fetching movies for ${genre}:`, error);
      }
    });
  }, []);

  const scrollMovies = (index: number, direction: 'left' | 'right') => {
    const container = movieContainerRefs.current[index];
    if (container) {
      const scrollAmount =
        direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filterBySearch = (movies: Movie[]) =>
    movies.filter((movie) =>
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <WelcomeBand />
      {genres.map((genre, index) => {
        const movies = filterBySearch(moviesByGenre[genre] || []);
        return (
          <div key={genre} className="movie-section">
            <h2 className="section-title">{genre}</h2>
            <div className="movie-scroll-container">
              <button
                className="scroll-arrow left"
                onClick={() => scrollMovies(index, 'left')}
              >
                &#60;
              </button>
              <div
                className="movie-container"
                ref={(el) => {
                  movieContainerRefs.current[index] = el;
                }}
              >
                {movies.map((movie, movieIndex) => (
                  <div className="movie-item" key={movieIndex}>
                    <img
                      src={`https://movie-images.s3.us-west-1.amazonaws.com/${movie.imageFileName}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="movie-title">{movie.title}</div>
                  </div>
                ))}
              </div>
              <button
                className="scroll-arrow right"
                onClick={() => scrollMovies(index, 'right')}
              >
                &#62;
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MoviesPage;
