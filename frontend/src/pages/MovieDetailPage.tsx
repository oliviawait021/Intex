import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL, fetchMovieById } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
import './MovieDetailPage.css';
import Footer from '../components/Footer';

const cleanTitle = (title: string): string => {
  const cleaned = title.replace(/[^a-zA-Z0-9 ]/g, ''); // remove special characters but keep letters, numbers, spaces
  return encodeURIComponent(cleaned.trim()); // URL encode the result
};

const MovieDetailPage = () => {
  const { show_id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  const user_id = 1;
  const movieContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollMovies = (index: number, direction: 'left' | 'right') => {
    const container = movieContainerRefs.current[index];
    if (container) {
      const scrollAmount =
        direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const saveMovieRating = async (
    user_id: number,
    show_id: string,
    rating: number
  ) => {
    try {
      const response = await fetch(`${baseURL}/Movie/${show_id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, rating }),
      });

      if (!response.ok)
        throw new Error(`Failed to save rating: ${response.status}`);
      console.log('Rating saved successfully');
    } catch (error: any) {
      console.error('Error saving rating:', error);
    }
  };

  const handleStarClick = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
    if (show_id) {
      saveMovieRating(user_id, show_id, newRating);
    } else {
      console.error('show_id is undefined');
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const res = await fetch(`${baseURL}/Movie/SimilarMovies/${show_id}`);
      if (!res.ok) throw new Error('Failed to fetch similar movies');
      const data = await res.json();
      setSimilarMovies(data);
    } catch (err) {
      console.error('Error fetching similar movies:', err);
    }
  };

  useEffect(() => {
    const loadMovie = async () => {
      if (!show_id) {
        setError('No movie ID provided');
        return;
      }

      try {
        const data = await fetchMovieById(show_id);
        setMovie(data);
      } catch (err: any) {
        console.error('Failed to fetch movie:', err);
        setError(err.message || 'Failed to load movie');
      }
    };

    loadMovie();
    fetchSimilarMovies();
  }, [show_id]);

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!movie) return <div className="loading-message">Loading...</div>;

  

  return (
    <>
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
              src={`https://movieposters9.blob.core.windows.net/movieposters9/${cleanTitle(movie.title)}.jpg`}
              alt={movie.title}
              className="movie-poster"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/images/default-poster.png';
              }}
            />
            <button className="watch-button">Watch Now</button>
            <div className="stars">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <span
                    key={index}
                    onClick={() => handleStarClick(index)}
                    style={{
                      cursor: 'pointer',
                      color: index < rating ? 'gold' : 'gray',
                    }}
                  >
                    ★
                  </span>
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

        {/* Recommended Carousel */}
        <div className="movie-section">
          <h2 className="section-title">Similiar to {movie.title}</h2>
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
              }}
            >
              {similarMovies.map((movie) => (
                <div
                  className="movie-item"
                  key={movie.show_id}
                  onClick={() =>
                    (window.location.href = `/movie/${movie.show_id}`)
                  }
                >
                  <img
                    src={`https://movieposters9.blob.core.windows.net/movieposters9/${cleanTitle(movie.title)}.jpg`}
                    alt={movie.title}
                    className="movie-poster"
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/images/default-poster.png';
                    }}
                  />
                  <div className="movie-title-detail">{movie.title}</div>
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
      <Footer />
    </>
  );
};

export default MovieDetailPage;
