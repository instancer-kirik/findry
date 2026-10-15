import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/use-theme'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './index.css'

const root = createRoot(document.getElementById("root")!);

// Render immediately without artificial delay
root.render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <ErrorBoundary><App /></ErrorBoundary>
    </ThemeProvider>
  </BrowserRouter>
);
