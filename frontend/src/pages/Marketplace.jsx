import { getMarketplaceItems } from '../services/marketplaceService';

const Marketplace = () => {
  const { addToCart, setIsCartOpen, cart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Urban Delivery', 'Industrial', 'Surveillance'];
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMarketplaceItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch marketplace items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.category === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-white font-bold">Logistics Marketplace</h2>
          <p className="text-dark-400 mt-1">Upgrade your fleet with the latest autonomous hardware.</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 bg-dark-900 border border-dark-800 rounded-xl hover:border-primary-500/50 transition-all text-dark-200"
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-dark-950 animate-in zoom-in">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-4">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === cat ? 'bg-primary-600 text-white border-primary-500' : 'bg-dark-900 text-dark-400 border-dark-800 hover:border-dark-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 opacity-50">
          {[1,2,3,4].map(i => <div key={i} className="glass-card aspect-[4/5] animate-pulse bg-dark-900"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="glass-card group overflow-hidden border-dark-800/50 hover:border-primary-500/30 transition-all">
              <div className="aspect-square bg-dark-950 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent opacity-60"></div>
                <Plane className="w-16 h-16 text-dark-800 group-hover:scale-125 group-hover:text-primary-900/50 transition-all duration-500" />
                <span className="absolute bottom-4 left-4 text-[10px] bg-dark-800/80 backdrop-blur-md px-2 py-1 rounded text-dark-300 font-bold uppercase tracking-wider border border-dark-700">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-white font-outfit font-bold">{item.modelNumber}</h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${item.type === 'rent' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-dark-500 mb-4 font-medium">{item.maxDistance}km Range | {item.maxWeight}kg Capacity</p>
                <div className="flex items-center justify-between pt-4 border-t border-dark-900">
                  <span className="text-2xl font-bold text-white">${item.price}{item.type === 'rent' && <span className="text-sm text-dark-500 font-medium"> / day</span>}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-dark-900 border border-dark-800 hover:bg-primary-600 hover:border-primary-500 text-white text-xs font-bold rounded-xl transition-all active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
