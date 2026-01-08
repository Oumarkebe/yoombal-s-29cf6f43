
import React from 'react';
import { Link } from 'react-router-dom';

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center space-x-2 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">Y</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">Yoombal</span>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bon retour !</h1>
      <p className="text-gray-600">Connectez-vous à votre compte</p>
    </div>
  );
}
