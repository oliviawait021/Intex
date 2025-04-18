import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import {
  fetchMovies,
  fetchUserInfo,
  deleteMovie,
  UserInfo,
} from '../api/MoviesAPI';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import AuthorizeView from '../components/AuthorizeView';
import SearchBar from '../components/SearchBar';
import './AdminMoviesPage.css';
import Footer from '../components/Footer';
import WelcomeBand from '../components/WelcomeBand';

const cleanTitle = (title: string): string => {
  const cleaned = title.replace(/[^a-zA-Z0-9 ]/g, ''); // remove special characters but keep letters, numbers, spaces
  return encodeURIComponent(cleaned.trim()); // URL encode the result
};

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showform, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [searchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handlePosterClick = (showId: string) => {
    navigate(`/admin/${showId}`);
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(pageSize, pageNum, []);

        setMovies(data.movies);
        setTotalPages(
          Number.isFinite(data.totalNumber) && pageSize > 0
            ? Math.ceil(data.totalNumber / pageSize)
            : 0
        );
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum]);

  useEffect(() => {
    console.log('showform state changed:', showform);
  }, [showform]); // Runs when showform changes

  useEffect(() => {
    fetchUserInfo()
      .then((info) => {
        setUserInfo(info);
        if (!info.isAuthenticated) {
          alert('You must be logged in to view this page.');
        } else if (!info.isAdmin) {
          alert('Only admins can access this page.');
        }
      })
      .catch((err) => {
        console.error('User info fetch failed', err);
      });
  }, []);

  const handleDelete = async (showId: string) => {
    if (!showId) {
      console.error('❌ showId is undefined or empty');
      alert('Invalid movie ID — cannot delete.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete?');
    if (!confirmDelete) return;

    try {
      console.log('🗑️ Attempting to delete movie:', showId);
      await deleteMovie(showId);
      setMovies(movies.filter((m) => m.show_id !== showId));
    } catch (error: any) {
      console.error('Delete failed:', error);
      const msg = error.message || '';
      if (msg.includes('401')) {
        alert('You must be logged in to delete a movie.');
      } else if (msg.includes('403')) {
        alert('Access denied. Only admins can delete movies.');
      } else {
        alert('Failed to delete movie. Please try again.\n' + msg);
      }
    }
  };

  if (!userInfo) return <p>Loading user info...</p>;
  if (loading) return <p>loading movies</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const displayedMovies = searchResults !== null ? searchResults : movies;

  return (
    <>
      <div className="admin-page">
        <WelcomeBand />
        <br />
        <AuthorizeView>
          <div className="admin-controls">
            <div className="admin-header">
              <br />
              <h1>Manage Movie Collection</h1>
              <div className="admin-controls-row">
                {userInfo.isAdmin && (
                  <>
                    <button
                      className="add-movie-button"
                      onClick={() => {
                        console.log('CLICKED ADD MOVIE');
                        console.log('admin: ' + userInfo.isAdmin);
                        console.log('auth: ' + userInfo.isAuthenticated);
                        setShowForm(true);
                      }}
                    >
                      Add Movie
                    </button>
                    <SearchBar onSearchResults={setSearchResults} />
                  </>
                )}
              </div>
            </div>
          </div>
        </AuthorizeView>

        {editingMovie && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <EditMovieForm
                movie={editingMovie}
                onSuccess={() => {
                  setEditingMovie(null);
                  fetchMovies(pageSize, pageNum, []).then((data) => {
                    setMovies(data.movies);
                    setTotalPages(
                      Number.isFinite(data.totalNumber) && pageSize > 0
                        ? Math.ceil(data.totalNumber / pageSize)
                        : 0
                    );
                  });
                }}
                onCancel={() => setEditingMovie(null)}
              />
            </div>
          </div>
        )}

        <div className="movie-list">
          {displayedMovies
            .filter((m) =>
              m.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((m) => {
              console.log(
                'Rendering movie:',
                m.title,
                'with show_id:',
                m.show_id
              );
              return (
                <div
                  onClick={() => handlePosterClick(m.show_id)}
                  key={m.show_id}
                  className="movie-card"
                >
                  <div className="movie-poster-container">
                    <img
                      src={`https://movieposters9.blob.core.windows.net/movieposters9/${cleanTitle(m.title)}.jpg`}
                      alt={m.title}
                      className="movie-poster"
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/images/default-poster.png';
                      }}
                    />
                  </div>
                  <div className="movie-info">
                    <h2>{m.title}</h2>
                    <p>
                      ID: {m.show_id} - {m.type} - {m.release_year}
                    </p>
                    <p>Type: {m.type}</p>
                    {!m.show_id && (
                      <p style={{ color: 'red' }}>
                        ⚠️ Warning: Movie missing show_id!
                      </p>
                    )}
                  </div>
                  {userInfo.isAdmin && (
                    <div className="movie-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Clicked edit for:', m);
                          if (!m.show_id) {
                            console.error(
                              '❌ Cannot edit movie with missing show_id:',
                              m
                            );
                          }
                          setEditingMovie(m);
                        }}
                        className="edit-btn"
                      >
                        <img src="/icons/editing.png" alt="Edit" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Clicked delete for:', m);
                          if (!m.show_id) {
                            console.error(
                              '❌ Cannot delete movie with missing show_id:',
                              m
                            );
                          }
                          handleDelete(m.show_id);
                        }}
                        className="delete-btn"
                      >
                        <img src="/icons/bin.png" alt="Delete" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <Pagination
          currentPage={pageNum}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageNum}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPageNum(1);
          }}
        />

        <button className="return-btn" onClick={() => navigate('/movies')}>
          Return to Movie Page
        </button>

        {showform && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <NewMovieForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchMovies(pageSize, pageNum, []).then((data) => {
                    setMovies(data.movies);
                    setTotalPages(
                      Number.isFinite(data.totalNumber) && pageSize > 0
                        ? Math.ceil(data.totalNumber / pageSize)
                        : 0
                    );
                  });
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminMoviesPage;
