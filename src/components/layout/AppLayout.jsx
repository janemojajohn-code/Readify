import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  FileText, 
  Settings, 
  Sparkles, 
  Moon, 
  Sun 
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export default function AppLayout() {
  const { settings, updateSettings, user } = useAuth();
  const location = useLocation();

  const isReaderPage = location.pathname.startsWith('/reader/');

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Library', path: '/library', icon: BookOpen },
    { label: 'Upload', path: '/upload', icon: Upload, isCenter: true },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 3.2 Top Navigation Bar */}
      <header className="sticky top-0 z-40 h-14 w-full border-b border-border/50 bg-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
        {/* Left: App Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 fill-primary/20" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            ReadFlow <span className="text-primary font-extrabold">AI</span>
          </span>
        </Link>

        {/* Right (Desktop): Nav Links + Quick Dark Mode */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1 mr-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                      isActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="h-9 w-9 rounded-xl border border-border/60 bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            title="Toggle Dark Mode"
          >
            {settings.darkMode ? <Sun className="h-4 w-4 text-chart-3" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Header Right (Dark Mode Toggle & Avatar) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="h-8 w-8 rounded-lg border border-border/60 bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {settings.darkMode ? <Sun className="h-4 w-4 text-chart-3" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Page Injector */}
      <main className={cn("flex-1 w-full", !isReaderPage && "pb-20 md:pb-6")}>
        <Outlet />
      </main>

      {/* 3.3 Bottom Navigation Bar (Mobile only, hidden on Desktop & when in Reader bar) */}
      {!isReaderPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 px-3 py-2 flex items-center justify-around shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.isCenter) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium mt-1 text-primary">Upload</span>
                </Link>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}

      {/* Toast Notification Container */}
      <Toaster />
    </div>
  );
}
