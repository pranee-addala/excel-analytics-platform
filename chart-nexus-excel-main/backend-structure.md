
# Backend Structure for Excel Analytics Platform

## Project Structure
```
backend/
├── server.js                 # Entry point
├── config/
│   ├── database.js           # MongoDB connection
│   └── jwt.js               # JWT configuration
├── models/
│   ├── User.js              # User schema
│   ├── ExcelRecord.js       # Excel data schema
│   └── Chart.js             # Saved charts schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── excel.js             # Excel upload/retrieval routes
│   └── charts.js            # Chart management routes
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── excelController.js   # Excel handling logic
│   └── chartController.js   # Chart management logic
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   ├── upload.js            # File upload middleware
│   └── errorHandler.js      # Error handling middleware
├── utils/
│   ├── excelParser.js       # Excel file parsing utility
│   └── responseHelper.js    # API response helper
├── uploads/                 # Uploaded files directory
├── .env                     # Environment variables
└── package.json
```

## Environment Variables (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
```

## Package Dependencies
```json
{
  "name": "excel-analytics-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Key Files Content

### server.js
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const excelRoutes = require('./routes/excel');
const chartRoutes = require('./routes/charts');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/charts', chartRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### models/ExcelRecord.js
```javascript
const mongoose = require('mongoose');

const excelRecordSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: [{
    type: mongoose.Schema.Types.Mixed
  }],
  columns: [String],
  rowCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExcelRecord', excelRecordSchema);
```

### models/Chart.js
```javascript
const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter'],
    required: true
  },
  config: {
    xAxis: String,
    yAxis: String,
    title: String
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  excelRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExcelRecord',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chart', chartSchema);
```

### routes/auth.js
```javascript
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Verify token
router.get('/verify', auth, authController.verifyToken);

module.exports = router;
```

### controllers/authController.js
```javascript
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse, sendError } = require('../utils/responseHelper');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists with this email', 400);
    }

    // Create new user
    const user = new User({ name, email, password, role: role || 'user' });
    await user.save();

    const token = generateToken(user._id);

    sendResponse(res, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, 201);
  } catch (error) {
    sendError(res, 'Registration failed', 500, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    sendResponse(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    sendError(res, 'Login failed', 500, error.message);
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    sendResponse(res, 'Token verified', { user });
  } catch (error) {
    sendError(res, 'Token verification failed', 500, error.message);
  }
};
```

### utils/excelParser.js
```javascript
const XLSX = require('xlsx');

exports.parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const columns = Object.keys(jsonData[0] || {});
    
    return {
      data: jsonData,
      columns,
      rowCount: jsonData.length
    };
  } catch (error) {
    throw new Error('Failed to parse Excel file');
  }
};
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Verify JWT token

### Excel Management
- POST `/api/excel/upload` - Upload Excel file
- GET `/api/excel` - Get all user's Excel records
- GET `/api/excel/:id` - Get specific Excel record

### Chart Management
- POST `/api/charts/save` - Save chart configuration
- GET `/api/charts` - Get user's saved charts
- DELETE `/api/charts/:id` - Delete saved chart

## Setup Instructions

1. Initialize the backend project:
```bash
mkdir excel-analytics-backend
cd excel-analytics-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors multer xlsx dotenv express-validator helmet express-rate-limit
npm install -D nodemon
```

2. Create the folder structure and files as outlined above

3. Set up MongoDB database (local or MongoDB Atlas)

4. Configure environment variables in `.env` file

5. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`
