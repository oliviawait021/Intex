import React, { useState } from 'react';
import { Movie } from '../types/Movie';
import { baseURL } from '../api/MoviesAPI';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearchResults: (movies: Movie[]) => void;
}
  
const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = async () => {
        try {
            let allMovies: Movie[] = [];
            let pageNum = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`${baseURL}/Movie/AllMoviesUnpaginated`, {
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Failed to fetch movies');

                const data = await response.json();
                const currentMovies = data.movies ?? [];

                allMovies = [...allMovies, ...currentMovies];
                hasMore = currentMovies.length === 100;
                pageNum++;
            }

            const filtered = allMovies
                .filter((movie: Movie) =>
                    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((movie: any) => ({
                    ...movie,
                    imageFileName: movie.imageFileName ?? '',
                    genre: movie.genre ?? 'Unknown'
                }));

            onSearchResults(filtered);
        } catch (err) {
            console.error(err);
            onSearchResults([]); // fallback
        }
    };
  
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '30px',
                padding: '0.5rem 1rem',
                width: '100%',
                maxWidth: '300px',
                marginLeft: 'auto',
                marginRight: '1rem',
                marginTop: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Search size={18} className="search-icon" />
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    flex: 1,
                    color: '#333',
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                }}
            />
            {searchTerm.length > 0 && (
                <button
                    type="button"
                    onClick={() => {
                        setSearchTerm('');
                        onSearchResults([]);
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        color: '#888',
                        cursor: 'pointer',
                        marginLeft: '0.5rem',
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default SearchBar;