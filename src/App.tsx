import React, { useState } from 'react';
import { Sparkles, Download, Image, Loader2 } from 'lucide-react';
import axios from 'axios';
import config from './config';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample images for the gallery
  const sampleImages = [
    'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?q=80&w=2069&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1686002359940-6a51b0d64f68?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1675426513141-f0020092d72e?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1675426512283-9b7c28b8d0e5?q=80&w=1974&auto=format&fit=crop'
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call our backend API using the config URL
      const response = await axios.post(`${config.API_URL}/generate-image`, {
        prompt: prompt
      });
      
      if (response.data.success) {
        setGeneratedImage(response.data.imageUrl);
      } else {
        throw new Error(response.data.message || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
      
      // Fallback to sample images if the API call fails
      const randomIndex = Math.floor(Math.random() * sampleImages.length);
      setGeneratedImage(sampleImages[randomIndex]);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `realpix-generated-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">RealPix</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Home</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">Gallery</li>
              <li className="hover:text-yellow-400 transition-colors cursor-pointer">About</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-5xl font-bold mb-4">Transform Your Ideas Into Art</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create stunning, unique images with the power of AI. Just describe what you want to see, and watch the magic happen.
        </p>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-white/70"
            />
            <button
              onClick={generateImage}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate
                </>
              )}
            </button>
          </div>
          
          {error && <p className="mt-2 text-red-400">{error}</p>}
          
          {generatedImage && (
            <div className="mt-8 relative group">
              <img 
                src={generatedImage} 
                alt="AI Generated" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={downloadImage}
                  className="px-4 py-2 bg-white text-purple-900 rounded-lg flex items-center font-medium hover:bg-yellow-400 transition-colors"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Describe Your Vision</h3>
            <p className="text-white/80">
              Enter a detailed description of the image you want to create. The more specific, the better!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Magic</h3>
            <p className="text-white/80">
              Our advanced AI processes your description and generates a unique image based on your input.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-pink-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
            <p className="text-white/80">
              Download your creation in high resolution and share it with the world or keep it for your personal projects.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Inspiration Gallery</h2>
        <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
          Check out these amazing AI-generated images created by our community
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleImages.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-xl group relative">
              <img 
                src={img} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white font-medium">AI Masterpiece #{index + 1}</p>
                <p className="text-white/80 text-sm">Created with RealPix</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are bringing their imagination to life with RealPix.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity">
            Start Creating Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <span className="text-xl font-bold">RealPix</span>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-white/80 hover:text-yellow-400 transition-colors">Privacy</a>
              <a href="#" className="text-white/80 hover:text-yellow-400 transition-colors">Terms</a>
              <a href="#" className="text-white/80 hover:text-yellow-400 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
            <p>© 2025 RealPix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;