import { useState } from 'react';
import { Movie } from '../types/Movie';
import { addMovie, getNextShowId } from '../api/MoivesAPI';
import '../pages/AdminMoviesPage.css';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    <div>
      <div
        className="modal-content"
        style={{
          backgroundColor: "#28262F",
          border: "2px solid white",
          borderRadius: "10px",
          width: "800px",
          margin: "0 auto",
          color: "white"
        }}
>
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center' }}>Add Movie</h2>
          <div className="form-grid">
            <label>
              Movie Title:
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </label>
            <label>
              Director:
              <input type="text" name="director" value={formData.director} onChange={handleChange} />
            </label>
            <br/><br/>
            <label>
              Year:
              <select name="releaseYear" value={formData.releaseYear} onChange={handleChange}>
                <option value="">Value</option>
                {[...Array(50)].map((_, i) => {
                  const year = 2025 - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </label>
            <label>
              Movie Duration:
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
            </label>
            <br/><br/>
            <label>
              Release Date:
              <input type="date" name="releaseDate" onChange={handleChange} />
            </label>
            <label>
              Type:
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">Value</option>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
            </label>
            <br/><br/>
            <label>
              IMDB Rating:
              <select name="rating" value={formData.rating} onChange={handleChange}>
                <option value="">Value</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
              </select>
            </label>
            <label>
              Genre:
              <select name="genre" onChange={handleChange}>
                <option value="">Value</option>
                <option value="Drama">Drama</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
              </select>
            </label>
            <br/><br/>
            <label>
              Country Made:
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Value</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            </label>
            <label>
              Cast List:
              <textarea name="cast" value={formData.cast} onChange={handleChange} />
            </label>
            <br/><br/>
            <label>
              Duration:
              <textarea name="text" value={formData.duration} onChange={handleChange} />
            </label>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMovieForm;
