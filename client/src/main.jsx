import ReactDOM from 'react-dom/client';
import { AuthProvider, CartProvider } from './contexts';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
