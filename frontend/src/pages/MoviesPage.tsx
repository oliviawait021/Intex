import React, { useState, useRef, useEffect } from 'react';
import './MoviesPage.css';
import WelcomeBand from '../components/WelcomeBand';
import axios from 'axios';
import { fetchUserInfo } from '../api/MoviesAPI';

const genreOptions = [
  'Documentary & Reality',
  'Drama',
  'Action & Adventure',
  'Comedy',
  'Family & Kids',
  'Other / Miscellaneous',
];

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
  const [userInfo, setUserInfo] = useState<{ isAuthenticated: boolean }>({
    isAuthenticated: true,
  });

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
      const response = await axios.get<{
        movies: Movie[];
        totalNumber: number;
      }>('https://localhost:5000/Movie/AllMovies', {
        params: {
          pageHowMany: 54,
          pageNum: page,
        },
      });
      const { movies: newMovies, totalNumber } = response.data;
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
    fetchMovies(pageNum);
  }, [pageNum]);

  useEffect(() => {
    console.log('Movies data:', movies);
  }, [movies]);

  useEffect(() => {
    fetchUserInfo()
      .then((info) => {
        setUserInfo(info);
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
        <div className="movie-scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollCarousel(topPicksRef, 'left')}
          >
            &#60;
          </button>
          <div className="movie-container" ref={topPicksRef}>
            {topPicks.map((movie) => (
              <div className="movie-item" key={movie.showId}>
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
            onClick={() => scrollCarousel(topPicksRef, 'right')}
          >
            &#62;
          </button>
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
              <div className="movie-item" key={movie.showId}>
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
      </div>

      <h2 className="section-title">Movies</h2>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div className="movie-item" key={movie.showId}>
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
            <div className="movie-title">{movie.title}</div>
          </div>
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: '1px' }} />
      {isLoading && <p className="loading-text">Loading more movies...</p>}
    </>
  );
};

export default MoviesPage;
