// src/App.js
import React from 'react';
import './App.css';
import FileUpload from './FileUpload';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Convertir PDF a texto</h1>
            </header>
            <FileUpload />
        </div>
    );
}

export default App;
