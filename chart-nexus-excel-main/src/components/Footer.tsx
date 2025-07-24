
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Excel Analytics Platform. All rights reserved.</p>
          <p className="mt-2">Built with React, Node.js, and MongoDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
