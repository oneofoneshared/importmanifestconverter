import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';

const PasswordOverlay = ({ onUnlock, children }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'ship') {
            onUnlock();
        } else {
            setError(true);
            setPassword('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError(false);
    };

    return (
        <div className="relative min-h-screen">
            {/* Blurred content */}
            <div className="filter blur-sm pointer-events-none">
                {children}
            </div>

            {/* Password overlay */}
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center mb-6">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
                        <p className="text-gray-600">Enter password to access the Import Manifest Converter</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter password"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                Incorrect password. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Unlock
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordOverlay; 