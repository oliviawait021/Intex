import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../api/MoviesAPI';
import Pagination from './Pagination';

function MovieList({ selectedCategories }: { selectedCategories: string[] }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  console.log('Current user role:', userRole);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(pageSize, pageNum, selectedCategories);

        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumber / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum, selectedCategories]);

  if (loading) return <p>loading movies</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <br />
      {userRole?.toLowerCase() === 'admin' && (
        <div className="text-right mb-4">
          <button
            className="btn btn-warning"
            onClick={() => navigate('/adminMovies')}
          >
            Manage Movies
          </button>
        </div>
      )}
      {movies.map((m) => (
        <div id="movieCard" className="card" key={m.showId}>
          <h3 className="card-title">{m.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Type:</strong> {m.type}
              </li>
              <li>
                <strong>Director:</strong> {m.director}
              </li>
              <li>
                <strong>Cast:</strong> {m.cast}
              </li>
              <li>
                <strong>Country:</strong> {m.country}
              </li>
              <li>
                <strong>Release Year:</strong> {m.releaseYear}
              </li>
              <li>
                <strong>Rating:</strong> {m.rating}
              </li>
              <li>
                <strong>Duration:</strong> {m.duration}
              </li>
              <li>
                <strong>Description:</strong> {m.description}
              </li>
            </ul>
            <button
              className="btn btn-success"
              onClick={() => navigate(`/details/${m.showId}`)}
            >
              Watch Now
            </button>
          </div>
        </div>
      ))}
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
    </>
  );
}

export default MovieList;
