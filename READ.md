# TE Assignment 2024

A full-stack project management application with CRUD operations built using React, Node.js, Express, and MongoDB.

## 🚀 Live Demo

**Frontend**: [Your Deployed Frontend URL]  
**Backend**: [Your Deployed Backend URL]

## 🛠️ Tech Stack

**Frontend**: React, React Router, Bootstrap 5  
**Backend**: Node.js, Express, MongoDB, Mongoose  
**Deployment**: Vercel

## ✨ Features

- Create, read, update, and delete projects
- Real-time search by project name or description
- Multi-select skills with visual badges
- Form validation (client & server side)
- Delete confirmation modal
- Fully responsive design (mobile, tablet, desktop)

## 📋 Local Setup

### Backend
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5001`

### Frontend
```bash
cd frontend
npm install
npm start
```
App runs on `http://localhost:3000`

**Note**: Update `API_URL` in frontend components to match your backend URL for deployment.

## 🌐 Deployment Instructions

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Add environment variable: `MONGODB_URI=your_mongodb_atlas_uri`
4. Deploy

### Frontend (Vercel/Netlify)
1. Update `API_URL` in `AddProject.js`, `EditProject.js`, `ProjectList.js` with deployed backend URL
2. Push to GitHub
3. Connect repository to deployment platform
4. Deploy

### MongoDB
Use **MongoDB Atlas** (free tier) for cloud database:
1. Create cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Add to backend environment variables

## 📁 Project Structure

```
├── backend/
│   ├── server.js          # Express server & API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main router
│   │   └── index.css      # Global styles
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

**Backend** (`.env`):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/te_assignment
PORT=5001
```

**Frontend**: Update `API_URL` constant in component files:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

## 📝 API Endpoints

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## ✅ Assignment Requirements

✔️ Project list on `/` route  
✔️ Edit and Delete buttons  
✔️ Delete confirmation  
✔️ Add/Edit forms with validations  
✔️ Search functionality  
✔️ Mobile responsive  
✔️ Proper architecture

---

**Developed for**: Techechelons Infosolutions Pvt Ltd Assignment