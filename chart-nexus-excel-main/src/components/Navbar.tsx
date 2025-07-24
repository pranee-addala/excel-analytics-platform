
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error logging out');
      } else {
        toast.success('Logged out successfully');
        navigate('/auth');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BarChart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Excel Analytics</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/chart-analysis')}>
              Analytics
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
