import React, { useState, useRef } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

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

const faqData = [
  {
    question: 'How does the recommendation system work?',
    answer:
      'Our recommendation system uses your viewing history and ratings to suggest movies you might enjoy based on similar users and preferences.',
  },
  {
    question: 'Can I change my account preferences?',
    answer:
      'Yes! Once logged in, you can update your preferences, ratings, and viewing habits anytime in your account settings.',
  },
  {
    question: 'Is my data secure with CineNiche?',
    answer:
      'Absolutely. We value your privacy and use secure practices to ensure your data is protected at all times.',
  },
];

const posterPaths = [
  '/images/the-matrix.jpg',
  '/images/inception.jpg',
  '/images/the-dark-night.jpg',
  '/images/avatar.jpg',
  '/images/interstellar.jpg',
  '/images/the-avengers.jpg',
  '/images/the-godfather.jpg',
  '/images/forrest-gump.jpg',
  // Add more groups as needed
];

const HomePage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Explicitly typing the refs as an array of HTMLDivElement or null
  const movieContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

  return (
    <>
      <div className="collage-container">
        <div className="collage-scroll scroll-row-1">
          {posterPaths.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`poster-${index}`}
              className="poster"
            />
          ))}
        </div>
        <div className="collage-overlay">
          <h1 className="title">CineNiche</h1>
        </div>
        <div className="collage-scroll scroll-row-2">
          {posterPaths.concat(posterPaths).map((src, index) => (
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
          <Link to="/register" className="account-button">
            Create Your Account
          </Link>
          <Link to="/login" className="account-button">
            Log in to Your Account
          </Link>
        </div>

        {/* Movie section repeated three times */}
        {["What's Hot", 'Recommended for You', 'Coming Soon'].map(
          (title, index) => (
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
                  onClick={() => scrollMovies(index, 'right')}
                >
                  &#62;
                </button>
              </div>
            </div>
          )
        )}

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

          <div className="faq-links">
            <Link to="/login" className="faq-link">
              Account
            </Link>
            <Link to="/privacy" className="faq-link">
              Privacy Policy
            </Link>
            <a href="#faq" className="faq-link">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
