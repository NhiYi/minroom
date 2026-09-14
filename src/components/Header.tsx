import { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Phone, User, LogOut, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem, AuthUser } from '../types';
import { formatPrice } from '../utils/format';

interface HeaderProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  themeColor: string;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function Header({
  cartItems,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  activeCategory,
  onSelectCategory,
  themeColor,
  currentUser,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const navLinks = [
    { id: 'all', label: 'Tất cả điện thoại' },
    { id: 'apple', label: 'Apple iPhone' },
    { id: 'samsung', label: 'Samsung Galaxy' },
    { id: 'oppo-realme', label: 'Oppo & Realme' },
    { id: 'vivo', label: 'Vivo Smartphones' },
    { id: 'accessories', label: 'Phụ kiện Mobile' },
  ];

  return (
    <header className="w-full z-40 bg-white">
      {/* Top Bar */}
      <div className="bg-[#0f172a] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Hotline CSKH: 1900 6868 (8:00 - 22:00)</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 ml-auto">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-200">
                  Xin chào, <strong className="text-white font-medium">{currentUser.fullName || currentUser.username}</strong>
                </span>
                <span className="text-slate-700">•</span>
                <button
                  onClick={onLogout}
                  className="text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-slate-200 hover:text-white cursor-pointer flex items-center gap-1.5 font-medium transition"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Đăng nhập / Đăng ký thành viên</span>
              </button>
            )}

            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="hover:text-white cursor-pointer hidden sm:inline">Hệ thống cửa hàng</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-200 cursor-pointer">
              <span>Tiếng Việt / VNĐ (₫)</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`sticky top-0 transition-all duration-200 border-b border-slate-100 ${
          isScrolled ? 'shadow-md py-3 bg-white/95 backdrop-blur-md' : 'py-4 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo - Modern Clean Typography */}
          <div
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex flex-col items-start select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                TECHZONE<span style={{ color: themeColor }}>.</span>
              </span>
              <span className="text-[10px] tracking-widest font-bold uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded hidden sm:inline">
                STORE
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold -mt-1">
              ĐIỆN THOẠI & CÔNG NGHỆ CHÍNH HÃNG
            </span>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectCategory(link.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all relative rounded-md ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{ backgroundColor: themeColor }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition flex items-center gap-2 cursor-pointer"
              title="Tìm kiếm sản phẩm"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs text-slate-400 hidden xl:inline">Tìm kiếm...</span>
            </button>

            {/* User Account / Auth Trigger */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                    title="Tài khoản khách hàng"
                  >
                    <div
                      className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: themeColor }}
                    >
                      {(currentUser.fullName || currentUser.username).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden md:inline">
                      {currentUser.fullName || currentUser.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.fullName || currentUser.username}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Thành viên VIP</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <div className="px-4 py-1.5 text-[11px] text-slate-400 font-medium">
                          Mã KH: #{currentUser.id}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất tài khoản</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                  title="Đăng nhập / Đăng ký"
                >
                  <User className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-semibold hidden md:inline">Đăng nhập</span>
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition relative cursor-pointer"
              title="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Mini Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm group cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:scale-105 transition" />
                {totalQuantity > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-[11px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    {totalQuantity}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">
                  Giỏ hàng
                </span>
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {totalPrice > 0 ? formatPrice(totalPrice) : '0₫'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {currentUser ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center"
                    style={{ backgroundColor: themeColor }}
                  >
                    {(currentUser.fullName || currentUser.username).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {currentUser.fullName || currentUser.username}
                    </div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="text-xs text-rose-600 font-semibold p-1 hover:underline"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 mb-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Đăng nhập / Đăng ký mua hàng</span>
              </button>
            )}

            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Danh mục điện thoại & công nghệ
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onSelectCategory(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeCategory === link.id
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

