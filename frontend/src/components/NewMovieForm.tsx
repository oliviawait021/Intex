import { useState } from 'react';
import { Movie } from '../types/Movie';
import { addMovie, getNextShowId } from '../api/MoivesAPI';

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    showId: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: 0,
    rating: '',
    duration: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newShowId = await getNextShowId();
    const newMovie = { ...formData, showId: newShowId };

    await addMovie(newMovie);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>
      <div className="form-grid">
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
        </label>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Director:
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </label>
        <label>
          Cast:
          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <label>
          Release Year:
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
          />
        </label>
        <label>
          Rating:
          <input
            type="text"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
        </label>
        <label>
          Duration:
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Movie</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewMovieForm;
