import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/use-theme'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById("root")!);

// Render immediately without artificial delay
root.render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
