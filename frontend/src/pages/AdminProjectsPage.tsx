import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "../types/Project";
import { deleteProject, fetchProjects } from "../api/ProjectsAPI";
import Pagination from "../components/Pagination";
import NewProjectForm from "../components/NewProjectForm";
import EditProjectForm from "../components/EditProjectForm";
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();
    const [error, setError] =useState<string | null> (null);
    const [loading, setLoading] =useState(true);
    const[showform, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    

    useEffect(() =>  {
        const loadProjects = async() => {
            try{
               setLoading(true);
               const data = await fetchProjects(pageSize,pageNum,[])
            
               setProjects(data.projects);
               setTotalPages(
                 Number.isFinite(data.totalNumProjects) && pageSize > 0
                   ? Math.ceil(data.totalNumProjects / pageSize)
                   : 0
               );
           } catch (error) {
               setError((error as Error).message);
           } finally {
               setLoading(false);
           }
       };

        loadProjects();

    }, [pageSize, pageNum]);

    const handleDelete = async (projectId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete?');
        if (!confirmDelete) return;

        try{
            await deleteProject(projectId);
            setProjects(projects.filter((p) => p.projectId !== projectId))
        } catch(error) {
            alert('Failed to delete projet. Please try again.')
        }
    };

    if (loading) return <p>loading projects</p>
    if (error) return <p className="text-red-500">Error: {error}</p>

    return(
        <>
        <AuthorizeView>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        
        <h1>Admin Projects</h1>
        

        {!showform && (
            <button 
            className= "btn btn-success mb-3"
            onClick={() => setShowForm(true)}>
                New Project</button>
        )}
        
        {showform && (
            <NewProjectForm 
              onSuccess={() => {
                setShowForm(false);
                setPageNum(1);
                fetchProjects(pageSize, pageNum, []).then((data) => {
                  setProjects(data.projects);
                  setTotalPages(Math.ceil(totalPages / pageSize));
                });
              }} 
              onCancel={() => setShowForm(false)}
            />
        )}

        {editingProject && (
            <EditProjectForm project={editingProject} onSuccess={() => {
                setEditingProject(null);
                fetchProjects(pageSize, pageNum, []).then((data) => setProjects(data.projects));
            }} 
            onCancel={() => setEditingProject(null)}/>
        )}

        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Regional Program</th>
                    <th>Impact</th>
                    <th>Phase</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {
                    projects.map((p) => (
                        <tr key={p.projectId}>
                            <td>{p.projectId}</td>
                            <td>{p.projectName}</td>
                            <td>{p.projectType}</td>
                            <td>{p.projectRegionalProgram}</td>
                            <td>{p.projectImpact}</td>
                            <td>{p.projectPhase}</td>
                            <td>{p.projectFunctionalityStatus}</td>
                            <td>
                                <button onClick={() => setEditingProject(p)}>Edit</button> 
                                <button  onClick={() => handleDelete(p.projectId)}>Delete</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>

        <Pagination 
            currentPage = {pageNum}
            totalPages = {totalPages}
            pageSize = {pageSize}
            onPageChange = {setPageNum}
            onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPageNum(1);
            }} 
        />
        </AuthorizeView>
        </>
    );

};

export default AdminProjectsPage;