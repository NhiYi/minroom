import { useState, type FormEvent } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck, User, Sparkles } from 'lucide-react';
import { CartItem, AuthUser } from '../types';
import { SHIPPING_FREE_THRESHOLD, COUPONS } from '../data/products';
import { formatPrice } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: (appliedCoupon: string | null) => void;
  themeColor: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  themeColor,
  currentUser,
  onOpenAuth,
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Free shipping calculation
  const amountToFreeShipping = Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / SHIPPING_FREE_THRESHOLD) * 100);

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const coupon = COUPONS[appliedCoupon];
    discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
  }

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (COUPONS[code]) {
      const c = COUPONS[code];
      if (subtotal < c.minOrder) {
        setCouponError(`Mã này áp dụng cho đơn từ ${formatPrice(c.minOrder)}`);
        return;
      }
      setAppliedCoupon(code);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Mã giảm giá không hợp lệ. Thử: BLOCKSY10');
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    onOpenCheckout(appliedCoupon);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                Giỏ Hàng Blocksy ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar (Blocksy WooCommerce feature) */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              {amountToFreeShipping > 0 ? (
                <span>
                  Mua thêm <strong>{formatPrice(amountToFreeShipping)}</strong> để được Miễn Phí Vận Chuyển!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">
                  🎉 Chúc mừng! Đơn hàng của bạn được Miễn Phí Vận Chuyển.
                </span>
              )}
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">Giỏ hàng của bạn đang trống</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Hãy khám phá các sản phẩm áo sơ mi, blazer và đầm hè mới nhất của chúng tôi.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
                  style={{ backgroundColor: themeColor }}
                >
                  Bắt đầu mua sắm
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-22 object-cover rounded-lg border border-slate-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                        Size {item.selectedSize}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l transition"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r transition"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Area with Coupons & Totals */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 bg-white p-6 space-y-4">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Mã giảm giá (ví dụ: BLOCKSY10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none uppercase font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-md mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Áp dụng mã <strong>{appliedCoupon}</strong></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-slate-400 hover:text-rose-600 text-[11px]"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t pt-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Giảm giá ({appliedCoupon}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Vận chuyển:</span>
                  <span className="font-semibold">
                    {amountToFreeShipping === 0 ? (
                      <span className="text-emerald-600 font-bold">Miễn phí</span>
                    ) : (
                      'Tính khi thanh toán'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t">
                  <span>Tổng tiền:</span>
                  <span style={{ color: themeColor }}>
                    {formatPrice(Math.max(0, subtotal - discountAmount))}
                  </span>
                </div>
              </div>

              {/* Member Auth Status Banner */}
              {currentUser ? (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                      ✓
                    </div>
                    <span className="text-emerald-900 font-medium">
                      Tài khoản: <strong>{currentUser.fullName || currentUser.username}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">
                    Tích 5% điểm
                  </span>
                </div>
              ) : (
                onOpenAuth && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-[11px]">Đăng nhập để tích điểm & nhận quà</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition"
                    >
                      Đăng nhập
                    </button>
                  </div>
                )
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                >
                  <span>Tiến Hành Thanh Toán</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold text-center transition"
                >
                  Tiếp tục xem thêm đồ đẹp
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
