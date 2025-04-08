import { Movie } from '../types/Movie'; // Adjust path if needed

interface FetchMoviesResponse {
  totalNumber: number;
  movies: Movie[];
  totalNumMovies: number;
}

const API_URL = 'https://localhost:5000/Movie';

export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `movieTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/allmovies?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

//Add a new movie
export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error('Failed to add movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding movie', error);
    throw error;
  }
};

export const updateMovie = async (
  showId: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${showId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedMovie),
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 403) {
        console.warn('Access denied: Admin privileges required to update movie.');
      } else if (response.status === 401) {
        console.warn('Unauthorized: User is not logged in.');
      }
      throw new Error(`Failed to update movie: ${response.status} - ${errorText} - ${showId}`);
    }

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      throw new Error('Unexpected response format. Expected JSON.');
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

export const deleteMovie = async (showId: string): Promise<void> => {
  try {
    const response = await fetch(
      `https://localhost:5000/Movie/DeleteMovie/${showId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    console.log(
      `Delete request sent for movie ${showId}, status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(`Failed to delete movie: ${showId} ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};
