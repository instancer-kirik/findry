import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/use-theme'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById("root")!);

// Add loading state
root.render(
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

// Render the app with theme provider
setTimeout(() => {
  root.render(
    <ThemeProvider defaultTheme="system" storageKey="theme-preference">
      <App />
    </ThemeProvider>
  );
}, 100);
