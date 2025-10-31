import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import AddProject from './components/AddProject';
import EditProject from './components/EditProject';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/edit-project/:id" element={<EditProject />} />
      </Routes>
    </Router>
  );
}
export default App;