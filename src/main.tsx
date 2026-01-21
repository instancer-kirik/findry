
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/use-theme'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById("root")!);

// Add subtle dark loading state
root.render(
  <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
    <div className="text-zinc-500 text-sm">Loading...</div>
  </div>
);

// Render the app with theme provider
setTimeout(() => {
  root.render(
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}, 100);
