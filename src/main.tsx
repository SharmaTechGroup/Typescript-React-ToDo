import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToDoIndex } from './to-do/todo-index.tsx'
import { CookiesProvider } from 'react-cookie'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <ToDoIndex />
    </CookiesProvider>
  </StrictMode>,
)
