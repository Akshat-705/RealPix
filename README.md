# RealPix Image Generator

RealPix is a powerful AI image generation application that transforms text descriptions into stunning visual artwork. Built with React for the frontend and Express.js for the backend, it leverages OpenAI's DALL-E model to create unique images based on user prompts.

## Features

- Text-to-image generation using AI
- Responsive, modern UI with Tailwind CSS
- Backend API with Express.js
- Integration with OpenAI's DALL-E
- Image download functionality
- Sample gallery of AI-generated images

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```
4. Replace `your_openai_api_key_here` with your actual OpenAI API key

### Running the Application

1. Start the backend server:
   ```
   npm run server
   ```
2. In a separate terminal, start the frontend development server:
   ```
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`

## How It Works

1. Users enter a text prompt describing the image they want to create
2. The frontend sends this prompt to the backend API
3. The backend communicates with OpenAI's DALL-E API to generate the image
4. The generated image URL is returned to the frontend and displayed to the user
5. Users can download the generated image

## Demo Mode

If no OpenAI API key is provided, the application will run in demo mode, using sample images instead of generating new ones.

## License

This project is licensed under the MIT License - see the LICENSE file for details.