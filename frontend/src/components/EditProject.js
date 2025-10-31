import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import Select, { components } from "react-select"; // Import react-select

const API_URL = 'http://localhost:5001/api';

// Use the same object format as AddProject.js
const SKILL_OPTIONS = [
  { value: "Asp.Net", label: "Asp.Net" },
  { value: "PHP", label: "PHP" },
  { value: "Java", label: "Java" },
  { value: "ReactJs", label: "ReactJs" },
  { value: "React Native", label: "React Native" },
  { value: "Angular", label: "Angular" }, // Value from your AddProject file
  { value: "NodeJs", label: "NodeJs" },
   { value: "PWA", label: "PWA" },
  { value: "Flutter", label: "Flutter" },
  { value: "VueJs", label: "VueJs" },
  { value: "Vanilla Js", label: "Vanilla Js" },
  { value: "SQL Server", label: "SQL Server" },
  { value: "My SQL", label: "My SQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "JavaScript/jQuery", label: "JavaScript/jQuery" },
];

const MEMBER_OPTIONS = ['1', '2', '3', '4', '5+'];

// Custom Checkbox component for react-select
const CheckboxOption = (props) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => null}
      style={{ marginRight: 8 }}
    />
    <label>{props.label}</label>
  </components.Option>
);

function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    skillSet: [],
    noOfMembers: '',
    isActive: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

 const fetchProject = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/projects/${id}`);
    const data = await response.json();

    const formattedSkills = Array.isArray(data.skillSet)
      ? data.skillSet.map((skill) => ({ value: skill, label: skill }))
      : [];

    setFormData({
      projectName: data.projectName || "",
      projectDescription: data.projectDescription || "",
      skillSet: formattedSkills, // store formatted data
      noOfMembers: data.noOfMembers || "",
      isActive: data.isActive ?? false,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    alert("Failed to fetch project details");
    navigate("/");
  } finally {
    setLoading(false);
  }
};

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project Name is required';
    }
    
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project Description is required';
    }
    
    if (formData.skillSet.length === 0) {
      newErrors.skillSet = 'At least one skill must be selected';
    }
    
    if (!formData.noOfMembers) {
      newErrors.noOfMembers = 'Number of Members is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setSubmitting(true);

  try {
    const payload = {
      ...formData,
      skillSet: formData.skillSet.map((s) => s.value), // ✅ convert back to string array
    };

    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Project updated successfully!");
      navigate("/");
    } else {
      alert("Failed to update project");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    alert("Failed to update project");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light ">
      <nav className="navbar navbar-dark navbar-custom mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">TE Assignment 2024</span>
        </div>
      </nav>

      <div className="container">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4">Edit Project</h2>
            
            <Form onSubmit={handleSubmit}>
              {/* Project Name */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Project Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  isInvalid={!!errors.projectName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.projectName}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Project Description */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Project Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                  isInvalid={!!errors.projectDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.projectDescription}
                </Form.Control.Feedback>
              </Form.Group>

              {/* --- NEW Skill Set Dropdown --- */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Skill Set <span className="text-danger">*</span>
                </Form.Label>
               <Select
  isMulti
  closeMenuOnSelect={false}
  hideSelectedOptions={false}
  components={{ Option: CheckboxOption }}
  options={SKILL_OPTIONS}
  value={formData.skillSet} // ✅ now we store objects, so no filtering needed
  onChange={(selected) =>
    setFormData({
      ...formData,
      skillSet: selected, // keep full {value, label} objects
    })
  }
  placeholder="Select Skills..."
  classNamePrefix="select"
  styles={{
    control: (base, state) => ({
      ...base,
      borderColor: errors.skillSet
        ? "red"
        : state.isFocused
        ? "#4e73df"
        : "#ced4da",
      borderRadius: "8px",
      minHeight: "45px",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(78, 115, 223, 0.15)"
        : null,
      "&:hover": {
        borderColor: errors.skillSet
          ? "red"
          : state.isFocused
          ? "#4e73df"
          : "#adb5bd",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e8f0fe" : "white",
      color: "#2c3e50",
      ":active": {
        ...provided[":active"],
        backgroundColor: "#e8f0fe",
      },
    }),
  }}
/>
                {errors.skillSet && (
                  <div className="text-danger small mt-1">{errors.skillSet}</div>
                )}
              </Form.Group>

              {/* Number of Members */}
              <Form.Group className="mb-3">
                <Form.Label>
                  No of Members <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.noOfMembers}
                  onChange={(e) => setFormData({...formData, noOfMembers: e.target.value})}
                  isInvalid={!!errors.noOfMembers}
                >
                  <option value="">Select...</option>
                  {MEMBER_OPTIONS.map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.noOfMembers}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Is Active */}
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  label="Is Active?"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
              </Form.Group>

              {/* Buttons */}
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={submitting}
                  className="btn-custom-blue" // Added custom class
                >
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/')}
                  disabled={submitting}
                  className="btn-custom-gray" // Added custom class
                >
                  Back
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default EditProject;
