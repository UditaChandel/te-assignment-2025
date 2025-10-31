import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const API_URL = 'http://localhost:5001/api';

function ProjectList() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const filtered = projects.filter(project =>
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
    }, [searchTerm, projects]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/projects`);
            const data = await response.json();
            setProjects(data);
            setFilteredProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('Failed to fetch projects. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/projects/${deleteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchProjects();
                setShowDeleteModal(false);
                setDeleteId(null);
                alert('Project deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${day}-${month}-${year} ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-dark navbar-custom mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">TE Assignment 2024</span>
                </div>
            </nav>

            <div className="container-fluid px-4">
                <div className="card shadow-sm">
                    <div className="card-body">
                        {/* Header with Title and Add Button */}
                        <div className="row mb-3">
                            <div className="col-12">
                                <h2 className="mb-0">My Project</h2>
                            </div>
                        </div>

                        {/* Search Bar + Add Project Button */}
                        <div className="row align-items-center mb-4">
                            {/* Search bar (left) */}
                            <div className="col-md-8 col-sm-12 mb-2 mb-md-0">
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by Project Name or Project Description"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>

                            {/* Add Project button (right) */}
                            <div className="col-md-4 col-sm-12 text-md-end text-center">
                                <button
                                    className="btn-custom-blue"
                                    onClick={() => navigate('/add-project')}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Project
                                </button>

                            </div>
                        </div>

                        {/* Projects Table */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Project Name</th>
                                            <th>Project Description</th>
                                            <th>Skill Set</th>
                                            <th>No of Members</th>
                                            <th>Is Active?</th>
                                            <th>Created Date</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
                                                    No projects found. Click "Add Project" to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProjects.map((project) => (
                                                <tr key={project._id}>
                                                    <td>{project.projectName}</td>
                                                    <td>{project.projectDescription}</td>
                                                    <td>{project.skillSet.join(', ')}</td>
                                                    <td>{project.noOfMembers}</td>
                                                    <td>
                                                        <span className={`badge ${project.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                            {project.isActive ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(project.createdAt)}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center justify-content-start gap-2">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => navigate(`/edit-project/${project._id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDeleteClick(project._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this project? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProjectList;