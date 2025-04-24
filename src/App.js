// src/App.js
import React, { useState } from 'react';
import './App.css';

const sampleWords = [
  { arabic: 'كتاب', english: 'Book' },
  { arabic: 'مدرسة', english: 'School' },
  { arabic: 'قلم', english: 'Pen' },
];

function App() {
  const [words, setWords] = useState(sampleWords);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newArabic, setNewArabic] = useState('');
  const [newEnglish, setNewEnglish] = useState('');

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setFlipped(false);
    setCurrent((current + 1) % words.length);
  };

    // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flashcards");
    if (saved) setFlashcards(JSON.parse(saved));
  }, []);
  
    // Save to localStorage
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const uploadedWords = JSON.parse(event.target.result);
        if (Array.isArray(uploadedWords)) {
          setWords(uploadedWords);
          setCurrent(0);
          setFlipped(false);
        } else {
          alert('Invalid JSON format');
        }
      } catch (err) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary.json';
    a.click();
  };

  const handleAddWord = () => {
    if (newArabic.trim() && newEnglish.trim()) {
      setWords([...words, { arabic: newArabic.trim(), english: newEnglish.trim() }]);
      setNewArabic('');
      setNewEnglish('');
    }
  };

  return (
    <div className="app">
      <h1>Arabic Flashcards</h1>
      <div className="card-container">
        <div className={`card ${flipped ? 'flipped' : ''}`}>
          <div className="card-face card-front">{words[current].arabic}</div>
          <div className="card-face card-back">{words[current].english}</div>
        </div>
      </div>
      <div className="controls">
        <button onClick={handleFlip}>Flip</button>
        <button onClick={handleNext}>Next Word</button>
        <button onClick={handleDownload}>Download Vocabulary</button>
        <input type="file" accept=".json" onChange={handleUpload} />
      </div>
      <div className="add-word-form">
        <input
          type="text"
          placeholder="Arabic"
          value={newArabic}
          onChange={(e) => setNewArabic(e.target.value)}
        />
        <input
          type="text"
          placeholder="English"
          value={newEnglish}
          onChange={(e) => setNewEnglish(e.target.value)}
        />
        <button onClick={handleAddWord}>Add Word</button>
      </div>
    </div>
  );
}

export default App;