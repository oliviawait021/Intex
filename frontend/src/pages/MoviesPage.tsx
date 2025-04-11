import React, { useState, useRef, useEffect } from 'react';
import './MoviesPage.css';
import WelcomeBand from '../components/WelcomeBand';
import { baseURL, fetchUserInfo } from '../api/MoviesAPI';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const cleanTitle = (title: string): string => {
  const cleaned = title.replace(/[^a-zA-Z0-9 ]/g, ''); // remove special characters but keep spaces
  return encodeURIComponent(cleaned.trim()); // encode once here
};

const genreOptions = [
  'Documentary & Reality',
  'Drama',
  'Action & Adventure',
  'Comedy',
  'Family & Kids',
  'Other / Miscellaneous',
];

interface Movie {
  show_id: string;
  title: string;
  imageFileName: string;
  genre: string;
}

interface Recommendation {
  rating: number;
  show_id: string;
}

const MoviesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [forYou, setForYou] = useState<Movie[]>([]);
  const [forYouLoading, setForYouLoading] = useState(false);
  const becauseYouWatchedIds = [
    's1273',
    's5534',
    's4209',
    's1',
    's1392',
    's769',
    's7607',
    's6235',
    's6414',
    's7361',
    's722',
  ];
  const [becauseTitle, setBecauseTitle] = useState('');
  const [becauseMovies, setBecauseMovies] = useState<Movie[]>([]);
  const [userRatedMovies, setUserRatedMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const navigate = useNavigate();
  const handlePosterClick = (show_id: string) => {
    navigate(`/movie/${show_id}`);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const topPicksRef = useRef<HTMLDivElement>(null!);
  const becauseYouLikedRef = useRef<HTMLDivElement>(null!);
  const userRatedRef = useRef<HTMLDivElement>(null!);

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

  const fetchMovies = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/Movie/AllMovies?pageHowMany=54&pageNum=${page}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      const { movies: newMovies, totalNumber } = data;
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.show_id));
        const uniqueNewMovies = newMovies.filter(
          (m: Movie) => !existingIds.has(m.show_id)
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

  const fetchMovieImgandTitle = async (
    show_id: string
  ): Promise<Movie | null> => {
    try {
      const response = await fetch(`${baseURL}/Movie/GetMovieById/${show_id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch movie details for ${show_id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie details for ${show_id}:`, error);
      return null;
    }
  };

  const fetchRecommendations = async () => {
    setForYouLoading(true);
    try {
      const response = await fetch(
        'https://cold-start-recommender-esbaczgkgkhcdyhh.eastus-01.azurewebsites.net/recommend',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age: 22,
            Male: 1,
            Other: 0,
            Netflix: 1,
            'Amazon Prime': 1,
            'Disney+': 1,
            'Paramount+': 1,
            Max: 0,
            Hulu: 1,
            'Apple TV+': 1,
            Peacock: 0,
          }),
        }
      );
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data as Recommendation[]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setForYouLoading(false);
    }
  };

  const fetchBecauseRecommendations = async () => {
    const randomId =
      becauseYouWatchedIds[
        Math.floor(Math.random() * becauseYouWatchedIds.length)
      ];
    try {
      const res = await fetch(
        `${baseURL}/Movie/BecauseRecommendations/${randomId}`,
        {
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Failed to fetch because movies');
      const movies = await res.json();
      setBecauseMovies(movies);
      const mainMovie = await fetchMovieImgandTitle(randomId);
      if (mainMovie) setBecauseTitle(mainMovie.title);
    } catch (err) {
      console.error('Error fetching because recommendations:', err);
    }
  };

  const fetchUserRatedRecommendations = async () => {
    try {
      const res = await fetch(`${baseURL}/Movie/UserBasedRecommendations/1`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch user rated movies');
      const movies = await res.json();
      setUserRatedMovies(movies);
    } catch (err) {
      console.error('Error fetching user rated recommendations:', err);
    }
  };

  useEffect(() => {
    fetchMovies(pageNum);
    fetchRecommendations();
    fetchBecauseRecommendations();
    fetchUserRatedRecommendations();
  }, [pageNum]);

  useEffect(() => {
    console.log('Recommendations state:', recommendations); //Log recommendations state
    if (recommendations.length > 0) {
      const getMovieDetails = async () => {
        setForYouLoading(true);
        try {
          const moviePromises = recommendations.map((rec) => {
            return fetchMovieImgandTitle(rec.show_id);
          });
          const recMovies = await Promise.all(moviePromises);
          const filteredMovies = recMovies.filter((movie) => movie !== null);
          setForYou(filteredMovies);
          console.log('forYou state:', filteredMovies); //Log forYou state
        } catch (error) {
          console.error('Error fetching movie details:', error);
        } finally {
          setForYouLoading(false);
        }
      };
      getMovieDetails();
    }
  }, [recommendations]);

  useEffect(() => {
    fetchUserInfo().then((info) => {
      if (!info.isAuthenticated) {
        alert('You must be logged in to view this page.');
      }
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
    if (sentinelRef.current) observer.current.observe(sentinelRef.current);
  }, [movies, isLoading, totalCount]);

  const filteredMovies =
    selectedGenres.length === 0
      ? movies
      : movies.filter((movie) => selectedGenres.includes(movie.genre));

  const displayedMovies = searchResults || filteredMovies;

  return (
    <>
      <WelcomeBand />
      <br /> <br />
      <SearchBar
        onSearchResults={(results) =>
          setSearchResults(results as unknown as Movie[])
        }
      />{' '}
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
        <h2 className="section-title">Personalized Picks</h2>
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
                  onClick={() => handlePosterClick(movie.show_id)}
                  className="movie-item"
                  key={movie.show_id}
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
                  <div className="movies-page-carousel-titles-size">
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

        <h2 className="section-title">Because you watched {becauseTitle}</h2>
        <div className="movie-scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollCarousel(becauseYouLikedRef, 'left')}
          >
            &#60;
          </button>
          <div className="movie-container" ref={becauseYouLikedRef}>
            {becauseMovies.map((movie) => (
              <div
                onClick={() => handlePosterClick(movie.show_id)}
                className="movie-item"
                key={movie.show_id}
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
                <div className="movies-page-carousel-titles-size">
                  {movie.title}
                </div>
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
      </div>
      <div className="recommendation-section">
        <h2 className="section-title">Inspired by your ratings</h2>
        <div className="movie-scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollCarousel(userRatedRef, 'left')}
          >
            &#60;
          </button>
          <div className="movie-container" ref={userRatedRef}>
            {userRatedMovies.map((movie) => (
              <div
                onClick={() => handlePosterClick(movie.show_id)}
                className="movie-item"
                key={movie.show_id}
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
                <div className="movies-page-carousel-titles-size">
                  {movie.title}
                </div>
              </div>
            ))}
          </div>
          <button
            className="scroll-arrow right"
            onClick={() => scrollCarousel(userRatedRef, 'right')}
          >
            &#62;
          </button>
        </div>
      </div>
      <h2 className="section-title">Movies</h2>
      <div className="movie-grid">
        {displayedMovies.map((movie) => (
          <div
            onClick={() => handlePosterClick(movie.show_id)}
            className="movie-item"
            key={movie.show_id}
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
