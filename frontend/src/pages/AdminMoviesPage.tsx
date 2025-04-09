import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import {
  deleteMovie,
  fetchMovies,
  fetchUserInfo,
  UserInfo,
} from '../api/MoivesAPI';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import './AdminMoviesPage.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
    const confirmDelete = window.confirm('Are you sure you want to delete?');
    if (!confirmDelete) return;

    try {
      await deleteMovie(showId);
      setMovies(movies.filter((m) => m.showId !== showId));
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('You must be logged in to delete a movie.');
      } else if (error.response?.status === 403) {
        alert('Access denied. Only admins can delete movies.');
      } else {
        alert('Failed to delete movie. Please try again.');
      }
    }
  };

  if (!userInfo) return <p>Loading user info...</p>;
  if (loading) return <p>loading movies</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <AuthorizeView>
        <Logout>
          Logout <AuthorizedUser value="role" />
        </Logout>

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
                      setShowForm(true);
                    }}
                  >
                    Add Movie
                  </button>
                  <div className="search-bar-container">
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Search for a movie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

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
          {movies
            .filter((m) =>
              m.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((m) => (
              <div key={m.showId} className="movie-card">
                <div className="movie-info">
                  <h2>{m.title}</h2>
                  <p>
                    ID: {m.showId} - {m.type} - {m.releaseYear}
                  </p>
                  <p>Type: {m.type}</p>
                </div>
                <div className="movie-actions">
                  <button
                    onClick={() => setEditingMovie(m)}
                    className="edit-btn"
                  >
                    <img src="/icons/editing.png" alt="Edit" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.showId)}
                    className="delete-btn"
                  >
                    <img src="/icons/bin.png" alt="Delete" />
                  </button>
                </div>
              </div>
            ))}
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
      </AuthorizeView>
    </>
  );
};

export default AdminMoviesPage;
