import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById, deleteMovie } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';
import EditMovieForm from '../components/EditMovieForm';
import './AdminDetailPage.css';

const AdminDetailPage = () => {
  const { showId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovie = async () => {
      try {
        if (showId) {
          const data = await fetchMovieById(showId);
          setMovie(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load movie');
      }
    };

    loadMovie();
  }, [showId]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(id);
      alert('Movie deleted successfully');
      navigate('/adminmovies'); // Redirect back to admin list
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

  const handleEditSuccess = async () => {
    setEditingMovie(null);
    if (showId) {
      const updatedMovie = await fetchMovieById(showId);
      setMovie(updatedMovie);
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!movie) return <div className="loading-message">Loading...</div>;

  const getPosterUrl = (filename: string) =>
    `https://movie-posters8.s3.us-east-1.amazonaws.com/Movie+Posters/${filename}`;

  return (
    <div className="movie-detail">
      <div className="movie-detail-container">
        <div className="back-button" onClick={() => window.history.back()}>
          &#x2B95;
        </div>
        <div className="movie-detail-grid">
          {/* Poster */}
          <div className="poster-section">
            <br />
            <br />
            <br />
            <img
              src={getPosterUrl(
                `${movie.title.replace(/[^\p{L}\p{N}\s]/gu, '').trim()}.jpg`
              )}
              alt={movie.title}
              className="poster-image"
              onError={(e) => {
                console.warn('Poster not found for:', movie.title);
                (e.currentTarget as HTMLImageElement).src =
                  '/images/default-poster.png';
              }}
            />
            <br />
            <br />
            <div className="edit-delete-button-container">
              <button
                onClick={() => setEditingMovie(movie)}
                className="edit-delete-button"
              >
                Edit
              </button>
              <br />
              <button
                onClick={() => handleDelete(movie.show_id)}
                className="edit-delete-button"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Movie Info */}
          <div className="info-section">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              <p>{movie.rating}</p>
              <p>{movie.duration}</p>
            </div>

            <div className="movie-description">
              <p className="label">Description:</p>
              <p>{movie.description}</p>
            </div>

            <div className="movie-cast">
              <p className="label">Cast:</p>
              <p>{movie.cast}</p>
            </div>

            <p className="movie-footer">
              <span className="label">Released Year:</span> {movie.release_year}
            </p>

            <p className="movie-footer">
              <span className="label">Released Country:</span> {movie.country}
            </p>

            <p className="movie-footer">
              <span className="label">Director:</span> {movie.director}
            </p>
          </div>
        </div>

        {/* Edit Modal */}
        {editingMovie && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <EditMovieForm
                movie={editingMovie}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingMovie(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDetailPage;
