import React, { useState, useRef } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

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
    question: 'What is CineNiche?',
    answer:
      'CineNiche is an up-and-coming movie streaming company focused on delivering curated, hard-to-find content to a passionate audience. Their catalog spans cult classics, international cinema, indie films, and niche documentaries, many of which are unavailable on larger mainstream platforms.',
  },
  {
    question: 'Where Can I Watch? ',
    answer:
      'Despite serving a small content niche, CineNiche has seen rapid growth in its subscriber base and has developed apps for a wide range of platforms, including Windows, Mac, iOS, Android, Roku, AppleTV, and more.',
  },
  {
    question: 'How much does CineNiche cost?',
    answer: 'Subscription plans range from $6.99 to $16.99 a month.',
  },
  {
    question: 'Is CineNiche good for kids?',
    answer:
      'CineNiche has a wide variety of movies, including many kid friendly films. Parents can filter movies by rating to find the perfect movie that is appropriate for all family members.',
  },
];

//This is for Top screen
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
                      <div className="movies-home-page-title-please">
                        {movie.name}
                      </div>
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

          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
