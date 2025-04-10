import { Project } from '../types/Project'; // Adjust path if needed

interface FetchProjectsResponse {
  totalNumber: number;
  projects: Project[];
  totalNumProjects: number;
}

const API_URL = 'https://localhost:5000/water';

export const fetchProjects = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchProjectsResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/allprojects?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      {
        credentials: "include"
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

//Add a new project
export const addProject = async (newProject: Project): Promise<Project> => {
  try {
    const response = await fetch(`${API_URL}/AddProject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(newProject),
    });

    if (!response.ok) {
      throw new Error('Failed to add project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding project', error);
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  updatedProject: Project
): Promise<Project> => {
  try {
    const response = await fetch(`${API_URL}/UpdateProject/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(updatedProject),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    const response = await fetch(
      `https://localhost:5000/Water/DeleteProject/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include"
      }
    );

    console.log(
      `Delete request sent for project ${projectId}, status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};