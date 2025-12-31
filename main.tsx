import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App'
import '../styles/globals.css'

console.log('🚀 [MAIN.TSX] Starting QuizRiot Arena...');
console.log('🔍 [MAIN.TSX] App import:', typeof App);
console.log('🔍 [MAIN.TSX] React:', typeof StrictMode);
console.log('🔍 [MAIN.TSX] Root element:', document.getElementById('root'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ ROOT ELEMENT NOT FOUND!');
  document.body.innerHTML = '<div style="color:white;padding:20px;background:red;">ERROR: Root element not found!</div>';
} else {
  console.log('✅ Root element found, creating React app...');
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('✅ React app rendered successfully!');
  } catch (error) {
    console.error('❌ React render failed:', error);
    document.body.innerHTML = `<div style="color:white;padding:20px;background:red;">ERROR: ${error}</div>`;
  }
}
