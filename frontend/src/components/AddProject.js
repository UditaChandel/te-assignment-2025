import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import Select, { components } from "react-select";

const API_URL = 'https://te-assignment-backend.onrender.com/api';

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

function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    skillSet: [],
    noOfMembers: '',
    isActive: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Project added successfully!');
        navigate('/');
      } else {
        alert('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please check if the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const skillOptions = SKILL_OPTIONS.map(skill => ({
    value: skill,
    label: skill
  }));

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark navbar-custom mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">TE Assignment 2024</span>
        </div>
      </nav>

      <div className="container">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4">Add Project</h2>
            
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

              {/* Skill Set (React-Select Dropdown) */}
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
    value={SKILL_OPTIONS.filter((opt) =>
      formData.skillSet.includes(opt.value)
    )}
    onChange={(selected) =>
      setFormData({
        ...formData,
        skillSet: selected.map((opt) => opt.value),
      })
    }
    placeholder="Select Skills..."
    classNamePrefix="select"
   styles={{
                    control: (base, state) => ({ // Add 'state' here
                      ...base,
                      // Apply border color based on error or focus state
                      borderColor: errors.skillSet
                        ? "red" // Error color
                        : state.isFocused
                          ? '#4e73df' // Your focus color
                          : '#ced4da', // Default border color
                      borderRadius: "8px",
                      minHeight: "45px",
                      // Apply box shadow on focus
                      boxShadow: state.isFocused
                        ? '0 0 0 0.2rem rgba(78, 115, 223, 0.15)' // Your focus shadow
                        : null,
                      // Ensure hover doesn't override focus styles
                      '&:hover': {
                        borderColor: errors.skillSet
                          ? "red"
                          : state.isFocused
                            ? '#4e73df'
                            : '#adb5bd' // A subtle hover color
                      }
                    }),
                    // Style fix from AddProject.js
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused
                        ? '#e8f0fe' // hover color
                        : state.isSelected
                          ? 'white'   // selected item background
                          : 'white',  // default background
                      color: '#2c3e50', // text color
                      ':active': {
                        ...provided[':active'],
                        backgroundColor: '#e8f0fe',
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
                   className="btn-custom-blue"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/')}
                  disabled={submitting}
                  className="btn-custom-gray" 
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

export default AddProject;