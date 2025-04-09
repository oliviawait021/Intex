import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovies } from '../api/MoivesAPI';
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

  const handleDelete = async (showId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete?');
    if (!confirmDelete) return;

    try {
      await deleteMovie(showId);
      setMovies(movies.filter((m) => m.showId !== showId));
    } catch (error) {
      alert('Failed to delete movie. Please try again.');
    }
  };

  if (loading) return <p>loading movies</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <AuthorizeView>
        <Logout className="logout">
          Logout <AuthorizedUser value="email" />
        </Logout>

        <div className="admin-header">
          <div className="header-content">
            <h1>Manage Movie Collection</h1>
            <button className="add-movie-button" onClick={() => setShowForm(true)}>
              Add Movie
            </button>
          </div>
        </div>

        {editingMovie && (
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
        )}

        <div className="movie-list">
          {movies.map((m) => (
            <div key={m.showId} className="movie-card">
              <div className="movie-info">
                <h2>{m.title}</h2>
                <p>ID: {m.showId} - {m.type} - {m.releaseYear}</p>
                <p>Status: Active</p>
              </div>
              <div className="movie-actions">
                <button onClick={() => handleDelete(m.showId)} className="delete-btn">🗑️</button>
                <button onClick={() => setEditingMovie(m)} className="edit-btn">✏️</button>
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
        )}
      </AuthorizeView>
    </>
  );
};

export default AdminMoviesPage;
