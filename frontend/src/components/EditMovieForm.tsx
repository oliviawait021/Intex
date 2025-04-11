import { useState } from 'react';
import { Movie } from '../types/Movie';
import { updateMovie } from '../api/MoviesAPI';
import Footer from './Footer';
interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}
const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMovie(formData.show_id, formData);
      console.log(formData.show_id);
      alert('Movie updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Failed to update movie:', error);
      alert('There was an error updating the movie.');
    }
  };
  return (
    <>
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-content">
          <h2 className="auth-title">Edit Movie</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="auth-input-group">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="director">Director</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="cast">Cast</label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="number"
                name="releaseYear"
                value={formData.release_year}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="rating">Rating</label>
              <input
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <button type="submit" className="auth-button">
              Update Movie
            </button>
            <button type="button" className="auth-button" onClick={onCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};
export default EditMovieForm;
