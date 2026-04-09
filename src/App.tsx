import { useState, useEffect } from 'react';
import { LeadForm } from './components/LeadForm';
import { AdminPanel } from './components/AdminPanel';
import { Auth } from './components/Auth';
import { Toaster } from '@/components/ui/sonner';
import { supabase } from '@/src/lib/supabase';
import { LogIn, LogOut, LayoutDashboard, UserPlus, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type View = 'form' | 'admin' | 'auth';

export default function App() {
  const [view, setView] = useState<View>('form');
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
        setView('admin');
      } else {
        setIsAdmin(null);
        setView('form');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (data) setIsAdmin(data.is_admin);
    else setIsAdmin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    setView('form');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => setView('form')}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic group-hover:scale-110 transition-transform">
              L
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">LeadFlow</span>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center gap-3">
                {view === 'admin' ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-500 font-bold"
                    onClick={() => setView('form')}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Form
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-indigo-600 font-bold bg-indigo-50"
                    onClick={() => setView('admin')}
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-200 text-slate-600 font-bold"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-100"
                onClick={() => setView(view === 'auth' ? 'form' : 'auth')}
              >
                {view === 'auth' ? (
                  <>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Form
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'form' && (
          <div className="max-w-4xl mx-auto">
            <LeadForm />
          </div>
        )}

        {view === 'auth' && (
          <div className="max-w-md mx-auto py-12">
            <Auth />
          </div>
        )}

        {view === 'admin' && (
          <AdminPanel />
        )}
      </main>

      <footer className="border-t border-slate-200 py-8 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            &copy; 2026 LeadFlow Systems. All rights reserved.
          </p>
        </div>
      </footer>
      
      <Toaster position="top-center" richColors />
    </div>
  );
}
