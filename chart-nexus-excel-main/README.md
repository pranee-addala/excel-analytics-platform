
# Excel Analytics Platform

A full-stack web application built with the MERN stack that allows users to upload Excel files, create interactive data visualizations, and save chart configurations.

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (User/Admin)
- Protected routes with automatic redirection
- Secure password hashing with bcrypt

### 📊 Excel Data Management
- Upload Excel files (.xlsx, .xls)
- Parse and store Excel data in MongoDB
- View data previews with pagination
- Column detection and data type inference

### 📈 Interactive Data Visualization
- Multiple chart types: Bar, Line, Pie, Scatter
- Dynamic chart configuration
- Real-time chart preview
- Interactive chart customization
- Save and manage chart configurations

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, professional interface
- Loading states and error handling
- Toast notifications for user feedback
- Card-based dashboard layout

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **React Router DOM** - Client-side routing
- **Chart.js & react-chartjs-2** - Data visualization
- **Axios** - HTTP client
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **XLSX** - Excel file parsing

## 🏗️ Project Structure

### Frontend Structure
```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Navbar.tsx         # Navigation component
│   ├── Footer.tsx         # Footer component
│   └── ProtectedRoute.tsx # Route protection
├── pages/
│   ├── Login.tsx          # Login page
│   ├── Register.tsx       # Registration page
│   ├── Dashboard.tsx      # User dashboard
│   └── ChartAnalysisPage.tsx # Chart creation page
├── services/
│   └── api.ts            # API service functions
└── App.tsx               # Main app component
```

### Backend Structure
```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   ├── ExcelRecord.js    # Excel data schema
│   └── Chart.js          # Chart configuration schema
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── excel.js          # Excel management routes
│   └── charts.js         # Chart management routes
├── controllers/
│   ├── authController.js
│   ├── excelController.js
│   └── chartController.js
├── middleware/
│   ├── auth.js           # JWT verification
│   └── upload.js         # File upload handling
├── utils/
│   └── excelParser.js    # Excel parsing utility
└── server.js             # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Backend Setup
1. Create a new directory for the backend:
```bash
mkdir excel-analytics-backend
cd excel-analytics-backend
```

2. Initialize the project:
```bash
npm init -y
```

3. Install dependencies:
```bash
npm install express mongoose bcryptjs jsonwebtoken cors multer xlsx dotenv express-validator helmet express-rate-limit
npm install -D nodemon
```

4. Create the backend structure as outlined in `backend-structure.md`

5. Configure environment variables:
```bash
# Create .env file
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
```

6. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Excel Management Endpoints
- `POST /api/excel/upload` - Upload Excel file
- `GET /api/excel` - Get all user's Excel records
- `GET /api/excel/:id` - Get specific Excel record with data

### Chart Management Endpoints
- `POST /api/charts/save` - Save chart configuration
- `GET /api/charts` - Get user's saved charts
- `DELETE /api/charts/:id` - Delete saved chart

## 🔧 Configuration

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:5000`. Update the `API_BASE_URL` in `src/services/api.ts` if your backend runs on a different port.

### Backend Configuration
Configure the following environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Backend server port (default: 5000)

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Excel**: Navigate to the dashboard and upload your Excel files
3. **Create Charts**: Go to Chart Analysis, select your data, and configure visualizations
4. **Save Charts**: Save your chart configurations for later use
5. **Dashboard**: View your uploaded files and saved charts

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Node.js
- UI components from shadcn/ui
- Charts powered by Chart.js
- Icons from Lucide React
