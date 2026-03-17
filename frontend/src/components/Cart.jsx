import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, CreditCard, Plane } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, totalCost, isCartOpen, setIsCartOpen } = useCart();

  const handleCheckout = () => {
    // Navigate to payment page and pass total cost and items
    setIsCartOpen(false);
    navigate('/payment', { 
      state: { 
        total: totalCost,
        items: cart 
      } 
    });
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
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-dark-900 rounded-lg text-dark-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!Array.isArray(cart) || cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <ShoppingBag className="w-16 h-16" />
              <p className="text-dark-400 font-medium">Your cart is empty.<br/>Start adding drones!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item?._id || Math.random()} className="p-4 bg-dark-900/50 border border-dark-800 rounded-2xl flex items-center gap-4 group hover:border-primary-500/30 transition-all">
                <div className="w-12 h-12 bg-dark-950 rounded-xl flex items-center justify-center border border-dark-800">
                  <Plane className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white tracking-tight">{item?.modelNumber || 'Unknown Item'}</h4>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest font-black">{item?.type || 'Part'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${item?.price || 0}</p>
                  <button 
                    type="button"
                    onClick={() => removeFromCart(item?._id)}
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
              type="button"
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

export default Cart;
