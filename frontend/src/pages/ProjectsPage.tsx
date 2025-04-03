import { useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ProjectList from "../components/ProjectList";
import WelcomeBand from "../components/WelcomeBand";
import CartSummary from "../components/cartSummary";
import { useNavigate } from "react-router-dom";
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

function ProjectsPage () {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const navigate = useNavigate();

    return (
        <>
        <AuthorizeView>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
            <CartSummary />
            <button onClick={() => navigate('/adminprojects')}>Manage Projects</button>
            <div className='container mt-4'>
                <WelcomeBand/>
              <div className='row'>
                <div className='col-md-3'>
                  <CategoryFilter selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}/>
                </div>
                <div className='col-md-9'>
                  <ProjectList selectedCategories={selectedCategories}/>
                </div>
              </div>
            </div>
        </AuthorizeView>
      </>
    );
}

export default ProjectsPage;