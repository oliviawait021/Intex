import { Search } from 'lucide-react';
import { useState } from 'react';

const genres = [
  'Movie',
  'TV Show',
  'Children',
  'Action',
  'Adventure',
  'Comedies',
  'Documentaries',
  'Docuseries',
  'Dramas',
  'Fantasy',
  'Musicals',
  'Spirituality',
  'Thrillers',
];

function WelcomeBand() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <h2 className="welcome-text">Welcome Zoldroyd!</h2>
      <br />
      <div className="genre-search-bar">
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
    </>
  );
}

export default WelcomeBand;
