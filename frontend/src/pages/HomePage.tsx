import React, { useState, useRef, useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Movie } from '../types/Movie';
import { baseURL } from '../api/MoviesAPI';

const cleanTitle = (title: string): string => {
  const cleaned = title.replace(/[^a-zA-Z0-9 ]/g, ''); // remove special characters but keep letters, numbers, spaces
  return encodeURIComponent(cleaned.trim()); // URL encode the result
};

const faqData = [
  {
    question: 'What is CineNiche?',
    answer:
      'CineNiche is an up-and-coming movie streaming company focused on delivering curated, hard-to-find content to a passionate audience...',
  },
  {
    question: 'Where Can I Watch? ',
    answer:
      'Despite serving a small content niche, CineNiche has seen rapid growth in its subscriber base...',
  },
  {
    question: 'How much does CineNiche cost?',
    answer: 'Subscription plans range from $6.99 to $16.99 a month.',
  },
  {
    question: 'Is CineNiche good for kids?',
    answer:
      'CineNiche has a wide variety of movies, including many kid friendly films...',
  },
];

const posterPaths1 = [
  '/images/imagesForTop/Case Closed.jpg',
  '/images/imagesForTop/Look Whos Back.jpg',
  '/images/imagesForTop/Oh My Ghost.jpg',
  '/images/imagesForTop/One Strange Rock.jpg',
  '/images/imagesForTop/Our Planet.jpg',
  '/images/imagesForTop/Pulp Fiction.jpg',
  '/images/imagesForTop/Ratched.jpg',
  '/images/imagesForTop/Reckoning.jpg',
  '/images/imagesForTop/Rugal.jpg',
];
const posterPaths2 = [
  '/images/imagesForTop/Sam  Cat.jpg',
  '/images/imagesForTop/Swiss Army Man.jpg',
  '/images/imagesForTop/The Adventures of Puss in Boots.jpg',
  '/images/imagesForTop/The Five Venoms.jpg',
  '/images/imagesForTop/The Little Mermaid.jpg',
  '/images/imagesForTop/The Silence.jpg',
  '/images/imagesForTop/The Trap.jpg',
  '/images/imagesForTop/Twilight.jpg',
  '/images/imagesForTop/Jaws.jpg',
];

const HomePage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);

  const movieContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollMovies = (index: number, direction: 'left' | 'right') => {
    if (movieContainerRefs.current[index]) {
      const scrollAmount =
        direction === 'left'
          ? -movieContainerRefs.current[index]!.clientWidth
          : movieContainerRefs.current[index]!.clientWidth;
      movieContainerRefs.current[index]!.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    fetch(`${baseURL}/Movie/TrendingNow`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data: Movie[]) => setTrendingMovies(data))
      .catch((err) => console.error('Failed to fetch trending:', err));

    fetch(`${baseURL}/Movie/NewReleases`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data: Movie[]) => setNewReleases(data))
      .catch((err) => console.error('Failed to fetch new releases:', err));
  }, []);

  return (
    <>
      <div className="collage-container">
        <div className="collage-scroll scroll-row-1">
          {posterPaths1.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`poster-${index}`}
              className="poster"
            />
          ))}
        </div>
        <div className="collage-overlay">
          <img
            src="/images/logo-without-text.PNG"
            alt="Background"
            className="hero-image"
          />
          <h1 className="title">CineNiche</h1>
        </div>
        <div className="collage-scroll scroll-row-2">
          {posterPaths2.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`poster-${index}`}
              className="poster"
            />
          ))}
        </div>
      </div>

      <br />
      <div className="home-container">
        {/* Buttons for account creation and login */}
        <div className="account-buttons">
          <Link to="/signup" className="account-button">
            Create Your Account
          </Link>
          <Link to="/login" className="account-button">
            Log in to Your Account
          </Link>
        </div>

        {/* TRENDING NOW Carousel */}
        <div className="movie-section">
          <h2 className="section-title">Top Movies and Shows</h2>

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
              {trendingMovies.map((movie, index) => (
                <div className="movie-item" key={index}>
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
                  <div className="movies-home-page-title-please">
                    {movie.title}
                  </div>
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

        {/* New Releases Carousel */}
        <div className="movie-section">
          <h2 className="section-title">New Releases</h2>

          <div className="movie-scroll-container">
            <button
              className="scroll-arrow left"
              onClick={() => scrollMovies(1, 'left')}
            >
              &#60;
            </button>

            <div
              className="movie-container"
              ref={(el) => {
                movieContainerRefs.current[1] = el;
              }}
            >
              {newReleases.map((movie, index) => (
                <div className="movie-item" key={index}>
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
                  <div className="movies-home-page-title-please">
                    {movie.title}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="scroll-arrow right"
              onClick={() => scrollMovies(1, 'right')}
            >
              &#62;
            </button>
          </div>
        </div>

        {/* FAQ section */}
        <div className="faq-container" id="faq">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          {faqData.map((item, index) => (
            <div
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              key={index}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{item.question}</span>
                <span className="faq-toggle">
                  {openIndex === index ? '-' : '+'}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
