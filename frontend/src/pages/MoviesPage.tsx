import React, { useState, useRef } from 'react';
import './MoviesPage.css';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Mystery',
  'Animation',
  'Documentary',
];

const movieData = [
  { name: 'The Matrix', poster: '/images/the-matrix.jpg' },
  { name: 'Inception', poster: '/images/inception.jpg' },
  { name: 'The Dark Knight', poster: '/images/the-dark-night.jpg' },
  { name: 'Avatar', poster: '/images/avatar.jpg' },
  { name: 'Interstellar', poster: '/images/interstellar.jpg' },
  { name: 'The Avengers', poster: '/images/the-avengers.jpg' },
  { name: 'The Godfather', poster: '/images/the-godfather.jpg' },
  { name: 'Forrest Gump', poster: '/images/forrest-gump.jpg' },
  { name: 'Titanic', poster: '/images/titanic.jpg' },
  { name: 'Brother Bear', poster: '/images/brother-bear.jpg' },
  { name: 'Mission: Impossible', poster: '/images/mission-impossible.jpg' },
  { name: 'Top Gun: Maverick', poster: '/images/topgun.jpg' },
  { name: 'Back to the Future', poster: '/images/back-to-the-future.jpg' },
  { name: 'Jurassic Park', poster: '/images/jurassic-park.jpg' },
  {
    name: 'The Silence of the Lambs',
    poster: '/images/the-silence-of-the-lambs.jpg',
  },
  { name: 'The Terminator', poster: '/images/the-terminator.jpg' },
  { name: 'The Green Mile', poster: '/images/the-green-mile.jpg' },
  { name: 'Coco', poster: '/images/coco.jpg' },
];

const MoviesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const movieContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollMovies = (index: number, direction: 'left' | 'right') => {
    const container = movieContainerRefs.current[index];
    if (container) {
      const scrollAmount =
        direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredMovies = movieData.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Welcome text */}
      <h2 className="welcome-text">Welcome Zoldroyd!</h2>
      <br />
      <div className="genre-search-bar">
        {/* Genre buttons */}
        <div className="genre-scroll-container">
          {genres.map((genre, i) => (
            <button className="genre-button" key={i}>
              {genre}
            </button>
          ))}
        </div>
        <div className="search-bar-container">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {[
        "What's Hot",
        'Recommended for You',
        'Coming Soon',
        'Action',
        'Comedy',
        'Drama',
        'Fantasy',
        'Horror',
        'Romance',
        'Sci-Fi',
        'Thriller',
        'Mystery',
        'Animation',
        'Documentary',
      ].map((title, index) => (
        <div key={index} className="movie-section">
          <h2 className="section-title">{title}</h2>
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
              {filteredMovies.map((movie, movieIndex) => (
                <div className="movie-item" key={movieIndex}>
                  <img
                    src={movie.poster}
                    alt={movie.name}
                    className="movie-poster"
                  />
                  <div className="movie-title">{movie.name}</div>
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
      ))}
    </>
  );
};

export default MoviesPage;
