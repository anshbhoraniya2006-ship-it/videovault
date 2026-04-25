import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">VideoVault</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2026 VideoVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;