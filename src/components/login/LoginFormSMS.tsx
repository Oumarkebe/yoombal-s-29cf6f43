
import React from 'react';

export function LoginFormSMS() {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">📱</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Connexion SMS/USSD</h3>
      <p className="text-gray-600 mb-4">
        Composez *123*456# pour vous connecter sans internet
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Code USSD:</strong> *123*456#<br />
          <strong>SMS:</strong> Envoyez "LOGIN" au 7777
        </p>
      </div>
    </div>
  );
}
