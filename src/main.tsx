import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/sunflower.css';
import './styles/animations.css';
import './styles/modals.css';
import './styles/old-letter.css';

createRoot(document.getElementById('root')!).render(<App />);
