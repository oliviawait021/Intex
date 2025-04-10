import React, { useState, useRef, useEffect } from 'react';
import './MoviesPage.css';
import WelcomeBand from '../components/WelcomeBand';
import { baseURL, fetchUserInfo } from '../api/MoviesAPI';
import { useNavigate } from 'react-router-dom';

const genreOptions = [
  'Documentary & Reality',
  'Drama',
  'Action & Adventure',
  'Comedy',
  'Family & Kids',
  'Other / Miscellaneous',
];

interface Recommendation {
  rating: number;
  show_id: string;
}

interface Movie {
  showId: string;
  title: string;
  imageFileName: string;
  genre: string;
}

const MoviesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [forYou, setForYou] = useState<Movie[]>([]); // New state for top picks
  const [forYouLoading, setForYouLoading] = useState(false);


  const navigate = useNavigate();
  const handlePosterClick = (showId: string) => {
    navigate(`/movie/${showId}`);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const topPicksRef = useRef<HTMLDivElement>(null!);
  const becauseYouLikedRef = useRef<HTMLDivElement>(null!);

  const toggleGenre = (genre: string) => {
    if (genre === 'Show All') {
      setSelectedGenres([]);
    } else {
      setSelectedGenres((prev) =>
        prev.includes(genre)
          ? prev.filter((g) => g !== genre)
          : [...prev, genre]
      );
    }
    setMovies([]);
    setPageNum(1);
  };

  const scrollCarousel = (
    ref: React.RefObject<HTMLDivElement>,
    direction: 'left' | 'right'
  ) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const topPicks: Movie[] = [];
  const becauseYouLiked: Movie[] = [];

  const fetchMovies = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/Movie/AllMovies?pageHowMany=54&pageNum=${page}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      const { movies: newMovies, totalNumber } = data;
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.showId));
        const uniqueNewMovies = newMovies.filter(
          (m: { showId: string }) => !existingIds.has(m.showId)
        );
        return [...prev, ...uniqueNewMovies];
      });
      setTotalCount(totalNumber);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getMovieDetails = async () => {
      const movies: Movie[] = [];
      for (const recommendation of recommendations) {
        const movie = await fetchMovieImgandTitle(recommendation.show_id);
        if (movie) {
          movies.push(movie);
        }
      }
      setForYou(movies);
    };

    if (recommendations.length > 0) {
      getMovieDetails();
    }
  }, [recommendations]);

  const fetchMovieImgandTitle = async (
    showId: string
  ): Promise<Movie | null> => {
    try {
      const response = await fetch(
        `https://localhost:5000/Movie/GetMovieById/${showId}` // Replace with your actual API endpoint
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch movie details for ${showId}`);
      }

      const movieDetails = await response.json();
      return movieDetails as Movie;
    } catch (error) {
      console.error(`Error fetching movie details for ${showId}:`, error);
      return null;
    }
  };

  const fetchRecommendations = async () => {
    setForYouLoading(true);
    try {
      const response = await fetch(
        'https://cold-start-recommender-esbaczgkgkhcdyhh.eastus-01.azurewebsites.net/recommend',
        {
          method: 'POST', // Explicitly using POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            age: 10, // Replace with actual user age
            Male: 1, // Replace with actual user gender
            Other: 0, // Replace with actual user gender
            Netflix: 1, // Replace with actual user platform preference
            'Amazon Prime': 0, // Replace with actual user platform preference
            'Disney+': 0, // Replace with actual user platform preference
            'Paramount+': 0, // Replace with actual user platform preference
            Max: 0, // Replace with actual user platform preference
            Hulu: 0, // Replace with actual user platform preference
            'Apple TV+': 0, // Replace with actual user platform preference
            Peacock: 0, // Replace with actual user platform preference
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data as Recommendation[]); // Store in recommendations
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setForYouLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(pageNum);
    fetchRecommendations();
  }, [pageNum]);

  useEffect(() => {
    console.log('Movies data:', movies);
  }, [movies]);

  useEffect(() => {
    fetchUserInfo()
      .then((info: { isAuthenticated: boolean }) => {
        if (!info.isAuthenticated) {
          alert('You must be logged in to view this page.');
        }
      })
      .catch((err) => {
        console.error('User info fetch failed', err);
      });
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoading &&
        movies.length < totalCount
      ) {
        setPageNum((prev) => prev + 1);
      }
    });
    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }
  }, [movies, isLoading, totalCount]);

  const filteredMovies =
    selectedGenres.length === 0
      ? movies
      : movies.filter((movie) => selectedGenres.includes(movie.genre));

  const formatTitleForS3 = (title: string) =>
    encodeURIComponent(title.trim()).replace(/%20/g, '+');

  const getPosterUrl = (title: string) =>
    `https://movie-posters8.s3.us-east-1.amazonaws.com/Movie+Posters/${formatTitleForS3(title)}.jpg`;

  return (
    <>
      <WelcomeBand />

      <div className="genre-filter-bar">
        {['Show All', ...genreOptions].map((genre) => (
          <button
            key={genre}
            className={`genre-box ${
              (genre === 'Show All' && selectedGenres.length === 0) ||
              selectedGenres.includes(genre)
                ? 'active'
                : ''
            }`}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="recommendation-section">
        <h2 className="section-title">Top Picks for You</h2>
        {forYouLoading && <p>Loading top picks...</p>}
        {!forYouLoading && (
          <div className="movie-scroll-container">
            <button
              className="scroll-arrow left"
              onClick={() => scrollCarousel(topPicksRef, 'left')}
            >
              &#60;
            </button>
            <div className="movie-container" ref={topPicksRef}>
              {forYou.map((movie) => (
                <div
                  onClick={() => handlePosterClick(movie.showId)}
                  className="movie-item"
                  key={movie.showId}
                >
                  <img
                    src={getPosterUrl(movie.title)}
                    alt={movie.title}
                    style={{ objectFit: 'contain' }}
                    className="movie-poster"
                    onError={(e) => {
                      console.log('Image not found for:', movie.title);
                      (e.currentTarget as HTMLImageElement).src =
                        '/images/default-poster.png';
                    }}
                  />

                  <div className="movie-title movies-page-title-please movies-page-carousel-titles-size">
                    {movie.title}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="scroll-arrow right"
              onClick={() => scrollCarousel(topPicksRef, 'right')}
            >
              &#62;
            </button>
          </div>
        )}
      </div>

      <h2 className="section-title">Recommended For You</h2>
      <div className="movie-scroll-container">
        <button
          className="scroll-arrow left"
          onClick={() => scrollCarousel(becauseYouLikedRef, 'left')}
        >
          &#60;
        </button>
        <div className="movie-container" ref={becauseYouLikedRef}>
          {becauseYouLiked.map((movie) => (
            <div
              onClick={() => handlePosterClick(movie.showId)}
              className="movie-item"
              key={movie.showId}
            >
              <img
                src={getPosterUrl(movie.title)}
                alt={movie.title}
                className="movie-poster"
                onError={(e) => {
                  console.log('Image not found for:', movie.title);
                  (e.currentTarget as HTMLImageElement).src =
                    '/images/default-poster.png';
                }}
              />

              <div className="movie-title">{movie.title}</div>
            </div>
          ))}
        </div>
        <button
          className="scroll-arrow right"
          onClick={() => scrollCarousel(becauseYouLikedRef, 'right')}
        >
          &#62;
        </button>
      </div>

      <h2 className="section-title">Movies</h2>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div
            onClick={() => handlePosterClick(movie.showId)}
            className="movie-item"
            key={movie.showId}
          >
            <img
              src={getPosterUrl(movie.title)}
              alt={movie.title}
              className="movie-poster"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                console.warn('Missing poster for:', movie.title);
                (e.currentTarget as HTMLImageElement).src =
                  '/images/default-poster.png';
              }}
            />
            <div className="movies-page-title-please">{movie.title}</div>
          </div>
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: '1px' }} />
      {isLoading && <p className="loading-text">Loading more movies...</p>}
    </>
  );
};

export default MoviesPage;
