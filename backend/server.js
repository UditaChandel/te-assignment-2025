const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const allowedOrigins = [
  'https://te-assignment-2025.vercel.app', // your Vercel frontend
  'http://localhost:3000' // optional: for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/te_assignment';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Project Schema
const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project Name is required'],
    trim: true
  },
  projectDescription: {
    type: String,
    required: [true, 'Project Description is required'],
    trim: true
  },
  skillSet: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one skill must be selected'
    }
  },
  noOfMembers: {
    type: String,
    required: [true, 'Number of Members is required'],
    enum: ['1', '2', '3', '4', '5+']
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

// ==================== ROUTES ====================

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      message: 'Error fetching projects', 
      error: error.message 
    });
  }
});

// Get single project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      message: 'Error fetching project', 
      error: error.message 
    });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { projectName, projectDescription, skillSet, noOfMembers, isActive } = req.body;
    
    // Validation
    if (!projectName || !projectName.trim()) {
      return res.status(400).json({ message: 'Project Name is required' });
    }
    
    if (!projectDescription || !projectDescription.trim()) {
      return res.status(400).json({ message: 'Project Description is required' });
    }
    
    if (!skillSet || skillSet.length === 0) {
      return res.status(400).json({ message: 'At least one skill must be selected' });
    }
    
    if (!noOfMembers) {
      return res.status(400).json({ message: 'Number of Members is required' });
    }
    
    const project = new Project({
      projectName: projectName.trim(),
      projectDescription: projectDescription.trim(),
      skillSet,
      noOfMembers,
      isActive: isActive || false
    });
    
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ 
      message: 'Error creating project', 
      error: error.message 
    });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { projectName, projectDescription, skillSet, noOfMembers, isActive } = req.body;
    
    // Validation
    if (!projectName || !projectName.trim()) {
      return res.status(400).json({ message: 'Project Name is required' });
    }
    
    if (!projectDescription || !projectDescription.trim()) {
      return res.status(400).json({ message: 'Project Description is required' });
    }
    
    if (!skillSet || skillSet.length === 0) {
      return res.status(400).json({ message: 'At least one skill must be selected' });
    }
    
    if (!noOfMembers) {
      return res.status(400).json({ message: 'Number of Members is required' });
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectName: projectName.trim(),
        projectDescription: projectDescription.trim(),
        skillSet,
        noOfMembers,
        isActive: isActive || false
      },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ 
      message: 'Error updating project', 
      error: error.message 
    });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully', project });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      message: 'Error deleting project', 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});