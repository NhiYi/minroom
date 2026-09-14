import { useState, useMemo, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, ProductColor, FilterState, AuthUser } from './types';
import { fetchFakeStoreProducts } from './services/api';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductFilters } from './components/ProductFilters';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { LookbookSection } from './components/LookbookSection';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';

export default function App() {
  // Theme styling (Blocksy Palette)
  const [themeColor, setThemeColor] = useState('#1e293b');

  // Customer Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('blocksy_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authContextMessage, setAuthContextMessage] = useState('');
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');

  // Dynamic products from FakeStoreAPI
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from FakeStoreAPI on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const res = await fetchFakeStoreProducts();
      if (isMounted) {
        setProducts(res.products);
        setCategories(res.categories);
        setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('blocksy_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial cart item
    return [
      {
        id: 'prod-1-M-Be Khói',
        product: PRODUCTS[0],
        selectedSize: 'M',
        selectedColor: PRODUCTS[0].colors[0],
        quantity: 1,
      },
    ];
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('blocksy_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['1', '2', '3'];
  });

  // Modals & Drawers state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutCoupon, setCheckoutCoupon] = useState<string | null>(null);

  // Filter & Catalog State
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 3000000,
    selectedSizes: [],
    selectedColors: [],
    sortBy: 'default',
    searchQuery: '',
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('blocksy_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('blocksy_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('blocksy_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('blocksy_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const openAuthModal = (contextMessage?: string, defaultTab: 'login' | 'register' = 'login') => {
    setAuthContextMessage(contextMessage || '');
    setAuthDefaultTab(defaultTab);
    setIsAuthOpen(true);
  };

  // Available unique sizes based on loaded products
  const availableSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => sizesSet.add(s)));
    return Array.from(sizesSet);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filter.category !== 'all') {
        if (
          filter.category !== product.categorySlug &&
          !product.tags.some((t) => t.toLowerCase().includes(filter.category))
        ) {
          return false;
        }
      }

      // Price filter
      if (product.price > filter.maxPrice) {
        return false;
      }

      // Size filter
      if (filter.selectedSizes.length > 0) {
        const hasSize = product.sizes.some((s) => filter.selectedSizes.includes(s));
        if (!hasSize) return false;
      }

      // Search keyword
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'price-asc') return a.price - b.price;
      if (filter.sortBy === 'price-desc') return b.price - a.price;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      if (filter.sortBy === 'popular') return b.reviewCount - a.reviewCount;
      return 0; // default Blocksy catalog sorting
    });
  }, [filter, products]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string,
    color: ProductColor,
    quantity: number = 1
  ) => {
    const compositeId = `${product.id}-${size}-${color.name}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: compositeId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds, products]);

  const handleCategorySelect = (catId: string) => {
    setFilter((prev) => ({ ...prev, category: catId }));
    const productSection = document.getElementById('san-pham');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col selection:bg-slate-900 selection:text-white">
      {/* 1. Main Blocksy Header */}
      <Header
        cartItems={cartItems}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeCategory={filter.category}
        onSelectCategory={handleCategorySelect}
        themeColor={themeColor}
        currentUser={currentUser}
        onOpenAuth={() => openAuthModal()}
        onLogout={handleLogout}
      />

      {/* 3. Blocksy Hero Section */}
      <HeroBanner
        onExploreClick={() => {
          const el = document.getElementById('san-pham');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        themeColor={themeColor}
      />

      {/* 4. Product Catalog / WooCommerce Archive Section */}
      <main id="san-pham" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                WOOCOMMERCE STORE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>FakeStoreAPI Live</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bộ Sưu Tập Thời Trang Trực Tuyến
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dữ liệu danh mục quần áo & phụ kiện được đồng bộ trực tiếp từ FakeStoreAPI.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-semibold text-slate-500">
            {isLoading ? 'Đang tải sản phẩm...' : `Hiển thị ${filteredProducts.length} / ${products.length} sản phẩm`}
          </div>
        </div>

        {/* Filters and Sorting Controls */}
        <div className="mb-8">
          <ProductFilters
            filter={filter}
            onFilterChange={setFilter}
            totalProducts={filteredProducts.length}
            availableSizes={availableSizes}
            themeColor={themeColor}
            categories={categories.length > 0 ? categories : undefined}
          />
        </div>

        {/* Product Cards Grid (Blocksy WooCommerce Layout) */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 animate-pulse flex flex-col"
              >
                <div className="aspect-[3/4] w-full bg-slate-100 rounded-lg"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
            <p className="text-xs text-slate-500 mt-1">
              Không có sản phẩm nào phù hợp với bộ lọc hiện tại của bạn.
            </p>
            <button
              onClick={() =>
                setFilter({
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 3000000,
                  selectedSizes: [],
                  selectedColors: [],
                  sortBy: 'default',
                  searchQuery: '',
                })
              }
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={(p, size, color) => {
                  handleAddToCart(p, size, color);
                  setIsCartOpen(true);
                }}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                themeColor={themeColor}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Blocksy Editorial Lookbook Grid */}
      <LookbookSection
        onQuickView={(p) => setQuickViewProduct(p)}
        products={products}
        themeColor={themeColor}
      />

      {/* 6. Customer Testimonials */}
      <CustomerReviews />

      {/* 7. Blocksy Multi-Widget Footer */}
      <Footer themeColor={themeColor} />

      {/* --- Interactive Modals & Offcanvas Drawers --- */}

      {/* Blocksy Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, size, color, qty) => {
          handleAddToCart(p, size, color, qty);
          setIsCartOpen(true);
        }}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        themeColor={themeColor}
      />

      {/* Blocksy Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={(coupon) => {
          setCheckoutCoupon(coupon);
          setIsCheckoutOpen(true);
        }}
        themeColor={themeColor}
        currentUser={currentUser}
        onOpenAuth={() => openAuthModal('Đăng nhập để nhận ưu đãi tích điểm 5% khi thanh toán!')}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={(id) =>
          setWishlistIds((prev) => prev.filter((pId) => pId !== id))
        }
        onAddToCart={(p, size, color) => {
          handleAddToCart(p, size, color);
          setIsCartOpen(true);
        }}
        themeColor={themeColor}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        products={products}
      />

      {/* Checkout Modal with VietQR & COD */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={checkoutCoupon}
        onOrderSuccess={handleOrderSuccess}
        themeColor={themeColor}
        currentUser={currentUser}
        onOpenAuth={() => openAuthModal('Đăng nhập tài khoản để tự động điền và tích lũy điểm thưởng!')}
      />

      {/* Customer Login / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        themeColor={themeColor}
        contextMessage={authContextMessage}
        defaultTab={authDefaultTab}
      />
    </div>
  );
}
