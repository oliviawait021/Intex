import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import { deleteMovie, fetchMovies } from '../api/MoivesAPI';
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

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
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>

        <h1>Admin Movies</h1>

        {!showform && (
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowForm(true)}
          >
            New Movie
          </button>
        )}

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

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Show ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Director</th>
              <th>Cast</th>
              <th>Country</th>
              <th>Release Year</th>
              <th>Rating</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.showId}>
                <td>{m.showId}</td>
                <td>{m.title}</td>
                <td>{m.type}</td>
                <td>{m.director}</td>
                <td>{m.cast}</td>
                <td>{m.country}</td>
                <td>{m.releaseYear}</td>
                <td>{m.rating}</td>
                <td>{m.duration}</td>
                <td>{m.description}</td>
                <td>
                  <button onClick={() => setEditingMovie(m)}>Edit</button>
                  <button onClick={() => handleDelete(m.showId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

        <button className="btn btn-danger" onClick={() => navigate('/movies')}>
          Return to Movie Page
        </button>
      </AuthorizeView>
    </>
  );
};

export default AdminMoviesPage;
