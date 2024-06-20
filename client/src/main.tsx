import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import process from 'process';

if (typeof window !== 'undefined') {
    window.process = process;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
