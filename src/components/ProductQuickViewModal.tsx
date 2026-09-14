import { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Ruler, Truck, RefreshCcw } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { formatPrice, calculateDiscount } from '../utils/format';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  themeColor: string;
}

export function ProductQuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  themeColor,
}: ProductQuickViewModalProps) {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'sizeChart' | 'shipping'>('desc');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const discountPercent = calculateDiscount(product.originalPrice, product.price);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-md flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Gallery Column */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between">
              {/* Main Photo Display */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200/60 p-6 flex items-center justify-center">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />

                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                    GIẢM {discountPercent}%
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-slate-900 ring-2 ring-slate-900/20'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Options & Details Column */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 max-h-[85vh] overflow-y-auto">
              <div>
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold uppercase tracking-wider text-slate-500">
                    {product.category}
                  </span>
                  <span className="font-mono">MÃ: {product.sku}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                  <span className="text-xs text-slate-400">
                    ({product.reviewCount} đánh giá từ khách hàng)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-2xl font-bold text-slate-900" style={{ color: themeColor }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mt-5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                    <span>MÀU SẮC: <span className="font-normal text-slate-600">{selectedColor.name}</span></span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor.name === color.name
                            ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor.name === color.name && (
                          <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
                    <span>KÍCH CỠ: <span className="font-normal text-slate-600">{selectedSize}</span></span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('sizeChart')}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Hướng dẫn chọn size</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                          selectedSize === size
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity and Add to cart row */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={addedSuccess}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                      addedSuccess ? 'bg-emerald-600 text-white' : 'text-white hover:opacity-95'
                    }`}
                    style={{ backgroundColor: addedSuccess ? undefined : themeColor }}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã thêm vào giỏ hàng thành công!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Thêm Vào Giỏ Hàng</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3.5 rounded-xl border transition ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    title="Yêu thích"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Stock info */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-3 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Hiện có sẵn <strong>{product.stock}</strong> sản phẩm trong kho</span>
                </div>
              </div>

              {/* Blocksy Accordion Info Tabs */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex border-b border-slate-200 text-xs">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-2 px-3 font-bold transition border-b-2 ${
                      activeTab === 'desc'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Chất liệu & Bảo quản
                  </button>
                  <button
                    onClick={() => setActiveTab('sizeChart')}
                    className={`pb-2 px-3 font-bold transition border-b-2 ${
                      activeTab === 'sizeChart'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Bảng Size Chuẩn
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 px-3 font-bold transition border-b-2 ${
                      activeTab === 'shipping'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Giao Hàng & Đổi Trả
                  </button>
                </div>

                <div className="pt-3 text-xs text-slate-600 leading-relaxed min-h-[70px]">
                  {activeTab === 'desc' && (
                    <div className="space-y-1">
                      <p>• <strong>Chất liệu:</strong> {product.material}</p>
                      <p>• Giặt máy ở chế độ nhẹ nhàng (dưới 30°C), không dùng chất tẩy mạnh.</p>
                      <p>• Phơi nơi râm mát, ủi mặt trái ở nhiệt độ thấp.</p>
                    </div>
                  )}

                  {activeTab === 'sizeChart' && (
                    <div className="space-y-1 text-[11px]">
                      <p>• <strong>Size S:</strong> Dưới 53kg, chiều cao 1m55 - 1m62</p>
                      <p>• <strong>Size M:</strong> 54kg - 63kg, chiều cao 1m63 - 1m70</p>
                      <p>• <strong>Size L:</strong> 64kg - 72kg, chiều cao 1m70 - 1m76</p>
                      <p>• <strong>Size XL:</strong> 73kg - 82kg, chiều cao 1m75 - 1m82</p>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-1 text-[11px]">
                      <p>• Giao hỏa tốc 2 giờ nội thành Hà Nội & TP.HCM.</p>
                      <p>• Giao tiêu chuẩn 2-3 ngày toàn quốc (Miễn phí cho đơn từ 500k).</p>
                      <p>• Đổi size và mẫu miễn phí trong 30 ngày nếu chưa qua sử dụng.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
