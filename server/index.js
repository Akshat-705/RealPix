import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Set up CORS
app.use(cors({
  origin: process.env.CLIENT_URL || (isProduction ? 'https://realpix.netlify.app' : 'http://localhost:5173'),
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up file storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'RealPix API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Generate image route
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // If no API key, return a mock response with a sample image
      const sampleImages = [
        'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?q=80&w=2069&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1686002359940-6a51b0d64f68?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1675426513141-f0020092d72e?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1675426512283-9b7c28b8d0e5?q=80&w=1974&auto=format&fit=crop'
      ];
      
      const randomIndex = Math.floor(Math.random() * sampleImages.length);
      
      return res.status(200).json({
        success: true,
        message: 'Demo mode: Using sample image (API key not configured)',
        imageUrl: sampleImages[randomIndex]
      });
    }
    
    // Generate image with OpenAI
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    
    const imageUrl = response.data[0].url;
    
    res.status(200).json({
      success: true,
      imageUrl: imageUrl
    });
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate image',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: isProduction ? 'An unexpected error occurred' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`RealPix server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`API available at http://localhost:${PORT}/api`);
});