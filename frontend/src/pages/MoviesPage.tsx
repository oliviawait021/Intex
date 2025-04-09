import React, { useState, useRef } from 'react';
import './MoviesPage.css';
import WelcomeBand from '../components/WelcomeBand';

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
}

const MoviesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

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
  };

  const topPicks: Movie[] = [
    { showId: '1', title: 'Inception', imageFileName: 'Inception.jpg' },
    { showId: '2', title: 'Moana', imageFileName: 'Moana.jpg' },
    { showId: '3', title: 'Frozen II', imageFileName: 'Frozen II.jpg' },
    { showId: '4', title: 'Encanto', imageFileName: 'Encanto.jpg' },
    { showId: '5', title: 'Black Panther', imageFileName: 'Black Panther.jpg' },
    { showId: '6', title: 'The Lion King', imageFileName: 'The Lion King.jpg' },
    {
      showId: '7',
      title: 'Avengers: Endgame',
      imageFileName: 'Avengers Endgame.jpg',
    },
    { showId: '8', title: 'Coco', imageFileName: 'Coco.jpg' },
    { showId: '9', title: 'Zootopia', imageFileName: 'Zootopia.jpg' },
    { showId: '10', title: 'Turning Red', imageFileName: 'Turning Red.jpg' },
  ];

  const becauseYouLiked: Movie[] = [
    {
      showId: '11',
      title: 'Jungle Cruise',
      imageFileName: 'Jungle Cruise.jpg',
    },
    { showId: '12', title: 'Cruella', imageFileName: 'Cruella.jpg' },
    { showId: '13', title: 'Luca', imageFileName: 'Luca.jpg' },
    {
      showId: '14',
      title: 'Raya and the Last Dragon',
      imageFileName: 'Raya and the Last Dragon.jpg',
    },
    { showId: '15', title: 'Soul', imageFileName: 'Soul.jpg' },
    { showId: '16', title: 'Onward', imageFileName: 'Onward.jpg' },
    { showId: '17', title: 'Big Hero 6', imageFileName: 'Big Hero 6.jpg' },
    { showId: '18', title: 'Brave', imageFileName: 'Brave.jpg' },
    {
      showId: '19',
      title: 'Wreck-It Ralph',
      imageFileName: 'Wreck It Ralph.jpg',
    },
    { showId: '20', title: 'Inside Out', imageFileName: 'Inside Out.jpg' },
  ];

  const topPicksRef = useRef<HTMLDivElement>(null!);
  const becauseYouLikedRef = useRef<HTMLDivElement>(null!);

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

  return (
    <>
      {/* <WelcomeBand /> */}

      {/* Genre Filter Bar */}
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

      {/* Recommendation Carousels */}
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
                  src={`https://movie-images.s3.us-west-1.amazonaws.com/${encodeURIComponent(movie.imageFileName)}`}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
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
                  src={`https://movie-images.s3.us-west-1.amazonaws.com/${encodeURIComponent(movie.imageFileName)}`}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
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
    </>
  );
};

export default MoviesPage;
