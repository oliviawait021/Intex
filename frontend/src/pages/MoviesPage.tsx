import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import MovieList from '../components/MovieList';
import WelcomeBand from '../components/WelcomeBand';
import { useNavigate } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

function MoviesPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  return (
    <>
      <AuthorizeView>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <div className="container mt-4">
          <WelcomeBand />
          <div className="row">
            <div className="col-md-3">
              <CategoryFilter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
            <div className="col-md-9">
              <MovieList selectedCategories={selectedCategories} />
            </div>
          </div>
        </div>
      </AuthorizeView>
    </>
  );
}

export default MoviesPage;
