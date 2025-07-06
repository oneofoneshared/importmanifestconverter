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
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md mx-auto">
                    <div className="text-center mb-4 sm:mb-6">
                        <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Lock size={24} className="sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
                        <p className="text-sm sm:text-base text-gray-600">Enter password to access the Import Manifest Converter</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter password"
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-600 text-xs sm:text-sm text-center">
                                Incorrect password. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
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