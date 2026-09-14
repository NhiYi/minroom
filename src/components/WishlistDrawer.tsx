import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  themeColor: string;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  themeColor,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="text-base font-bold text-slate-900">
                Sản Phẩm Yêu Thích ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-slate-100">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">Chưa có sản phẩm yêu thích</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Nhấn vào biểu tượng trái tim ở các mẫu điện thoại để lưu lại xem sau.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm transition cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                >
                  Khám phá điện thoại
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-18 h-22 object-cover rounded-lg border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {formatPrice(product.price)}
                    </p>

                    <button
                      onClick={() => {
                        onAddToCart(product, product.sizes[0] || 'M', product.colors[0]);
                        onRemoveFromWishlist(product.id);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold transition"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
