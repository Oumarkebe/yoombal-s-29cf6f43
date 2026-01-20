import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-xl font-bold">Yoombal</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              La première plateforme e-commerce hors ligne du Sénégal. Commerce inclusif avec
              paiement échelonné pour tous.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-sm">📧</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-sm">📞</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-sm">🌐</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/marketplace"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/bnpl" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Paiement échelonné
                </Link>
              </li>
              <li>
                <Link
                  to="/merchants"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Devenir marchand
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Devenir livreur
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Yoombal. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                Conforme aux normes BCEAO • GDPR • PCI-DSS
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
