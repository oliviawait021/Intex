import { Movie } from '../types/Movie';

interface FetchMoviesResponse {
  totalNumber: number;
  movies: Movie[];
  totalNumMovies: number; // optional, can remove if unused
}

export const baseURL = "https://cineniche-backend-group22-b0hjeafqeaf5fcf9.eastus-01.azurewebsites.net/";
//export const baseURL = "https://localhost:5000/";

const API_URL = `${baseURL}/Movie`;

// 🔹 Fetch paginated & filtered movies
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
      `${API_URL}/allmovies?pageSize=${pageSize}&pageNum=${pageNum}${
        selectedCategories.length ? `&${categoryParams}` : ''
      }`,
      { credentials: 'include' }
    );

    if (!response.ok) throw new Error('Failed to fetch movies');

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// 🔹 Add a new movie
export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) throw new Error('Failed to add movie');

    return await response.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// 🔹 Update an existing movie
export const updateMovie = async (
  showId: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${showId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedMovie),
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 403) {
        console.warn('Access denied: Admin privileges required.');
      } else if (response.status === 401) {
        console.warn('Unauthorized: Please log in.');
      }
      throw new Error(
        `Failed to update movie: ${response.status} - ${errorText} - ${showId}`
      );
    }

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    throw new Error('Unexpected response format. Expected JSON.');
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// 🔹 Delete a movie by showId
export const deleteMovie = async (showId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${showId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

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

// 🔹 Get next available showId (e.g. "s8809")
export const getNextShowId = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/GetMaxShowId`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get next showId');
  }

  return await response.text();
};

export interface UserInfo {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName: string;
}

export const fetchUserInfo = async (): Promise<UserInfo> => {
  const res = await fetch(`${API_URL}/api/auth/userinfo`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user info');
  }

  return await res.json();
};

// 🔹 Get movie by showId
export const fetchMovieById = async (showId: string): Promise<Movie> => {
  const response = await fetch(`${API_URL}/GetMovieById/${showId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movie with ID: ${showId}`);
  }

  return await response.json();
};
