import { useState, useMemo } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export function SearchModal({ isOpen, onClose, onSelectProduct, products = PRODUCTS }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingTerms = ['Mens', 'Womens', 'Jacket', 'Shirt', 'Backpack'];

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
          
          {/* Search Header Input */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm áo sơ mi, blazer, đầm nữ..."
              className="w-full text-base outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Đóng (ESC)
            </button>
          </div>

          {/* Trending Searches */}
          {!searchTerm && (
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Tìm kiếm phổ biến hôm nay</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {searchTerm && (
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-400 px-2">
                Tìm thấy {results.length} sản phẩm phù hợp
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Không tìm thấy sản phẩm nào với từ khóa &quot;{searchTerm}&quot;
                </div>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-18 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {product.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
