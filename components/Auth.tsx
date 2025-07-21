
import React, { useState } from 'react';

// A simple SVG icon for Google
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8S106.5 11.8 244 11.8S488 120.3 488 261.8zm-244 80.3c65.2 0 118.4-53.2 118.4-118.4s-53.2-118.4-118.4-118.4-118.4 53.2-118.4 118.4 53.2 118.4 118.4 118.4z" />
    </svg>
);


interface AuthProps {
    onLogin: (user: { email: string; name: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.endsWith('@gmail.com')) {
            setError('Please use a valid Gmail address.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (!isLoginView && !name) {
            setError('Please enter your full name.');
            return;
        }
        
        // Simulate successful authentication/registration
        onLogin({ email, name: isLoginView ? email.split('@')[0] : name });
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
             <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 tracking-tight">
                    Comprehensive Lab QC Analyzer
                </h1>
                <p className="mt-2 text-lg text-gray-400">Please sign in to continue</p>
            </header>
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
                <div className="flex border-b border-gray-600 mb-6">
                    <button
                        onClick={() => setIsLoginView(true)}
                        className={`w-1/2 py-3 text-center font-semibold transition-colors ${isLoginView ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLoginView(false)}
                        className={`w-1/2 py-3 text-center font-semibold transition-colors ${!isLoginView ? 'text-blue-400 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLoginView && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Gmail Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@gmail.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                        >
                            <GoogleIcon />
                            {isLoginView ? 'Sign in with Gmail' : 'Sign up with Gmail'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
