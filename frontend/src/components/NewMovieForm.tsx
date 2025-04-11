import { useState } from 'react';
import { Movie } from '../types/Movie';
import { addMovie, getNextShowId } from '../api/MoviesAPI';
import '../pages/AdminMoviesPage.css';

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    show_id: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    release_year: 0,
    rating: '',
    duration: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newShowId = await getNextShowId();
    const newMovie = { ...formData, show_Id: newShowId };

    await addMovie(newMovie);
    onSuccess();
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-content">
          <h2 className="auth-title">Add Movie</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="auth-input-group">
              <label htmlFor="title">Movie Title</label>
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
              <label htmlFor="releaseYear">Year</label>
              <select
                name="releaseYear"
                value={formData.release_year}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="">Value</option>
                {[...Array(50)].map((_, i) => {
                  const year = 2025 - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="auth-input-group">
              <label htmlFor="duration">Movie Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="">Value</option>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </div>
            <div className="auth-input-group">
              <label htmlFor="rating">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="">Value</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
              </select>
            </div>
            <div className="auth-input-group">
              <label htmlFor="genre">Genre</label>
              <select
                name="genre"
                onChange={handleChange}
                className="auth-input"
              >
                <option value="">Value</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Documentary & Reality</option>
                <option value="Action">Action & Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Comedy">Family & Kids</option>
                <option value="Comedy">Other/Miscellaneous</option>
              </select>
            </div>
            <div className="auth-input-group">
              <label htmlFor="country">Country Made</label>
              <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="auth-input"
            />
            </div>
            <div className="auth-input-group">
              <label htmlFor="cast">Cast List</label>
              <textarea
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <button type="submit" className="auth-button">
              Submit
            </button>
            <button type="button" className="auth-button" onClick={onCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMovieForm;
