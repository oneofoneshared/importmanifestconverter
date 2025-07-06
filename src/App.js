import React, { useState } from 'react';
import PDFToEDIConverter from './components/PDFToEDIConverter';
import PasswordOverlay from './components/PasswordOverlay';

function App() {
    const [isUnlocked, setIsUnlocked] = useState(() => {
        // Check localStorage on initial load
        return localStorage.getItem('manifestConverterUnlocked') === 'true';
    });

    const handleUnlock = () => {
        setIsUnlocked(true);
        // Save to localStorage
        localStorage.setItem('manifestConverterUnlocked', 'true');
    };

    if (!isUnlocked) {
        return (
            <PasswordOverlay onUnlock={handleUnlock}>
                <div className="App min-h-screen bg-gray-50">
                    <PDFToEDIConverter />
                </div>
            </PasswordOverlay>
        );
    }

    return (
        <div className="App min-h-screen bg-gray-50">
            <PDFToEDIConverter />
        </div>
    );
}

export default App;