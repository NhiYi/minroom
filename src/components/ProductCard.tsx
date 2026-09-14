import { useState, type MouseEvent } from 'react';
import { Eye, Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice, calculateDiscount } from '../utils/format';

interface ProductCardProps {
  key?: string;
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  themeColor: string;
}

export function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  themeColor,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = calculateDiscount(product.originalPrice, product.price);
  const currentImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  const handleQuickAdd = (e: MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.sizes[0] || 'M', selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className="group relative bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container with Hover Actions */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-white p-4 cursor-pointer flex items-center justify-center"
        onClick={() => onQuickView(product)}
      >
        {/* Main & Hover Swap Image */}
        <img
          src={currentImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges: SALE, MỚI, HOT */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-500 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-600 text-white shadow-sm">
              MỚI
            </span>
          )}
          {product.isHot && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500 text-white shadow-sm">
              HOT
            </span>
          )}
        </div>

        {/* Right Floating Actions (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                : 'bg-white/90 text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
            title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 text-slate-600 hover:bg-white hover:text-slate-900 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Xem nhanh chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Slide-Up "Quick Add To Cart" Button */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={addedAnimation}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-md transition ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-900 hover:bg-slate-900 hover:text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã thêm vào giỏ!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Thêm vào giỏ hàng</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-slate-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] font-semibold text-slate-700">{product.rating}</span>
              <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition cursor-pointer line-clamp-1 mt-1"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c)}
              className={`w-4 h-4 rounded-full border transition-all ${
                selectedColor.name === c.name ? 'ring-2 ring-offset-1 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <span className="text-[11px] text-slate-400 ml-1">
            {product.sizes.length} tùy chọn
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100">
          <span className="text-base font-bold text-slate-900" style={{ color: discountPercent > 0 ? themeColor : undefined }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
