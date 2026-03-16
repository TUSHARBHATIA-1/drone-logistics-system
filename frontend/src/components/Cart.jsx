import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalCost, isCartOpen, setIsCartOpen } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/marketplace/checkout', { items: cart }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Placeholder for real auth token
        }
      });
      alert('Checkout successful! Drones added to your fleet.');
      clearCart();
      setIsCartOpen(false);
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      <div className="relative w-full max-w-md bg-dark-950 border-l border-dark-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-dark-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-primary-500 w-6 h-6" />
            <h2 className="text-xl font-outfit font-bold text-white">Your Fleet Cart</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-dark-900 rounded-lg text-dark-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <ShoppingBag className="w-16 h-16" />
              <p className="text-dark-400 font-medium">Your cart is empty.<br/>Start adding drones!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="p-4 bg-dark-900/50 border border-dark-800 rounded-2xl flex items-center gap-4 group hover:border-primary-500/30 transition-all">
                <div className="w-12 h-12 bg-dark-950 rounded-xl flex items-center justify-center border border-dark-800">
                  <PlaneIcon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white tracking-tight">{item.modelNumber}</h4>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest font-black">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${item.price}</p>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-[10px] text-red-500 font-black uppercase tracking-tighter hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-dark-900 bg-dark-900/20 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-dark-400 font-medium">Subtotal</span>
              <span className="text-2xl font-outfit font-bold text-white">${totalCost}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 shadow-none active:scale-95 transition-transform"
            >
              Confirm Checkout <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-[10px] text-center text-dark-600 uppercase tracking-widest font-black">
              <CreditCard className="inline w-3 h-3 mr-1 mb-0.5" /> Secure Transaction Encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlaneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

export default Cart;
