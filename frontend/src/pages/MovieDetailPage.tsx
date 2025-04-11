import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
import './MovieDetailPage.css';

const movieData = [
  {
    name: 'The Matrix',
    poster: '/images/the-matrix.jpg',
  },
  {
    name: 'Inception',
    poster: '/images/inception.jpg',
  },
  {
    name: 'The Dark Knight',
    poster: '/images/the-dark-night.jpg',
  },
  {
    name: 'Avatar',
    poster: '/images/avatar.jpg',
  },
  {
    name: 'Interstellar',
    poster: '/images/interstellar.jpg',
  },
  {
    name: 'The Avengers',
    poster: '/images/the-avengers.jpg',
  },
  {
    name: 'The Godfather',
    poster: '/images/the-godfather.jpg',
  },
  {
    name: 'Forrest Gump',
    poster: '/images/forrest-gump.jpg',
  },
  {
    name: 'Titanic',
    poster: '/images/titanic.jpg',
  },
  {
    name: 'Brother Bear',
    poster: '/images/brother-bear.jpg',
  },
  {
    name: 'Mission: Impossible',
    poster: '/images/mission-impossible.jpg',
  },
  {
    name: 'Top Gun: Maverick',
    poster: '/images/topgun.jpg',
  },
  {
    name: 'Back to the Future',
    poster: '/images/back-to-the-future.jpg',
  },
  {
    name: 'Jurassic Park',
    poster: '/images/jurassic-park.jpg',
  },
  {
    name: 'The Silence of the Lambs',
    poster: '/images/the-silence-of-the-lambs.jpg',
  },
  {
    name: 'The Terminator',
    poster: '/images/the-terminator.jpg',
  },
  {
    name: 'The Green Mile',
    poster: '/images/the-green-mile.jpg',
  },
  {
    name: 'Coco',
    poster: '/images/coco.jpg',
  },
];

const MovieDetailPage = () => {
  const { showId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Explicitly typing the refs as an array of HTMLDivElement or null
  const movieContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollMovies = (index: number, direction: 'left' | 'right') => {
    if (movieContainerRefs.current[index]) {
      const scrollAmount =
        direction === 'left'
          ? -movieContainerRefs.current[index].clientWidth
          : movieContainerRefs.current[index].clientWidth;
      movieContainerRefs.current[index].scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const loadMovie = async () => {
      console.log('showId:', showId);
      if (!showId) {
        setError('No movie ID provided');
        return;
      }
      try {
        const data = await fetchMovieById(showId);
        setMovie(data);
      } catch (err: any) {
        console.error('Failed to fetch movie:', err);
        setError(err.message || 'Failed to load movie');
      }
    };

    loadMovie();
  }, [showId]);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!movie) return <div className="loading-message">Loading...</div>;

  // Helper to get full S3 poster URL
  const getPosterUrl = (filename: string) =>
    `https://movie-posters8.s3.us-east-1.amazonaws.com/Movie+Posters/${filename}`;

  return (
    <div className="movie-detail-container">
      <div className="back-button" onClick={() => window.history.back()}>
        &#x2B95;
      </div>
      <div className="movie-detail-grid">
        {/* Poster */}
        <div className="poster-section">
          <br />
          <br />
          <img
            src={getPosterUrl(
              `${movie.title.replace(/[^\p{L}\p{N}\s]/gu, '').trim()}.jpg`
            )}
            alt={movie.title}
            className="poster-image"
            onError={(e) => {
              console.warn('Poster not found for:', movie.title);
              (e.currentTarget as HTMLImageElement).src =
                '/images/default-poster.png';
            }}
          />
          <button className="watch-button">Watch Now</button>
          <div className="stars">
            {Array(5)
              .fill('★')
              .map((star, index) => (
                <span key={index}>{star}</span>
              ))}
          </div>
        </div>

        {/* Movie Info */}
        <div className="info-section">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-footer">
            <span className="label">Released Year:</span> {movie.release_year}
          </p>
          <p className="movie-footer">
            <span className="label">Released Country:</span> {movie.country}
          </p>
          <p className="movie-footer">
            <span className="label">Director:</span> {movie.director}
          </p>
          <div className="movie-description">
            <p className="label">Description:</p>
            <p>{movie.description}</p>
          </div>
          <div className="movie-cast">
            <p className="label">Cast:</p>
            <p>{movie.cast}</p>
          </div>
          <div className="movie-meta">
            <p>{movie.rating}</p>
            <p>{movie.duration}</p>
          </div>
        </div>
      </div>
      {/* Movie section rendered only once */}
      <div className="movie-section">
        <h2 className="section-title">Recommended for You</h2>

        <div className="movie-scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollMovies(0, 'left')}
          >
            &#60;
          </button>
          <div
            className="movie-container"
            ref={(el) => {
              movieContainerRefs.current[0] = el;
            }} // Assigning ref without type issue
          >
            {movieData.map((movie, movieIndex) => (
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
            onClick={() => scrollMovies(0, 'right')}
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
