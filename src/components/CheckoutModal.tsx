import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, Truck, ShieldCheck, Copy, Check, User, Sparkles } from 'lucide-react';
import { CartItem, AuthUser } from '../types';
import { SHIPPING_FREE_THRESHOLD, STANDARD_SHIPPING_FEE, COUPONS } from '../data/products';
import { formatPrice } from '../utils/format';
import { syncOrderToFakeStoreApi } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: string | null;
  onOrderSuccess: () => void;
  themeColor: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderSuccess,
  themeColor,
  currentUser,
  onOpenAuth,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || currentUser?.username || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    city: 'Hà Nội',
    paymentMethod: 'cod' as 'cod' | 'vietqr' | 'momo',
    note: '',
  });

  // Sync user info into form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName || currentUser.username,
        email: prev.email || currentUser.email,
      }));
    }
  }, [currentUser]);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    discountAmount = Math.round((subtotal * COUPONS[appliedCoupon].discountPercent) / 100);
  }

  const shippingFee =
    subtotal >= SHIPPING_FREE_THRESHOLD || appliedCoupon === 'FREESHIP'
      ? 0
      : STANDARD_SHIPPING_FEE;

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    const randomId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setOrderPlaced(true);
    
    // Sync cart order to FakeStoreAPI /carts endpoint
    syncOrderToFakeStoreApi(
      cartItems.map((item) => ({
        productId: Number(item.product.id) || 1,
        quantity: item.quantity,
      }))
    );

    onOrderSuccess();
  };

  const copyBankInfo = () => {
    navigator.clipboard.writeText(`190368688866 TECHCOMBANK - ${orderId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={orderPlaced ? undefined : onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Thanh Toán Đơn Hàng</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Thanh toán an toàn, bảo mật thông tin chuẩn SSL
              </p>
            </div>
            {!orderPlaced && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {orderPlaced ? (
            /* Order Placed Success View */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Đặt Hàng Thành Công!
                </h3>
                <p className="text-xs text-slate-500">
                  Cảm ơn quý khách <strong>{formData.fullName}</strong>. Mã đơn hàng của bạn là:
                </p>
                <div className="inline-block px-4 py-1.5 bg-slate-100 font-mono font-bold text-base text-slate-800 rounded-lg mt-2">
                  {orderId}
                </div>
              </div>

              {formData.paymentMethod === 'vietqr' && (
                <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <span>Quét mã VietQR chuyển khoản:</span>
                    </span>
                    <button
                      onClick={copyBankInfo}
                      className="text-[11px] text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Đã sao chép' : 'Sao chép STK'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center p-1 border">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TECHCOMBANK-190368688866-${finalTotal}-${orderId}`}
                        alt="Mã QR Chuyển khoản VietQR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs space-y-1 text-slate-600">
                      <div>Ngân hàng: <strong>Techcombank</strong></div>
                      <div>Số tài khoản: <strong>1903 6868 8866</strong></div>
                      <div>Chủ tài khoản: <strong>TECHZONE STORE VIETNAM</strong></div>
                      <div>Số tiền: <strong className="text-rose-600">{formatPrice(finalTotal)}</strong></div>
                      <div>Nội dung: <strong className="text-blue-600">{orderId}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 max-w-sm mx-auto text-xs text-slate-500 space-y-1">
                <p>Chuyên viên chăm sóc khách hàng sẽ liên hệ qua SĐT <strong>{formData.phone}</strong> trong vòng 15 phút để xác nhận đơn hàng.</p>
                <p>Thời gian giao hàng dự kiến: <strong>1-2 ngày làm việc</strong>.</p>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl text-white font-bold text-xs shadow-md transition"
                style={{ backgroundColor: themeColor }}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmitOrder} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Shipping info */}
              <div className="md:col-span-7 space-y-4">
                {/* Member Status Notice */}
                {currentUser ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold">{currentUser.fullName || currentUser.username}</span>
                        <span className="text-emerald-700 text-[11px] block">{currentUser.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                      Tài khoản VIP
                    </span>
                  </div>
                ) : (
                  onOpenAuth && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="text-[11px]">Đã có tài khoản? Đăng nhập để tự động điền & tích điểm</span>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  )
                )}

                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Thông tin người nhận
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email nhận thông báo đơn hàng
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-slate-800 bg-white"
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Tỉnh thành khác">Tỉnh thành khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Địa chỉ cụ thể (Số nhà, đường) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Số 12 ngõ 34 Phố..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ghi chú giao hàng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="Giao giờ hành chính, gọi trước khi đến..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-slate-800"
                  />
                </div>

                {/* Payment Methods */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    2. Phương thức thanh toán
                  </h3>

                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="accent-slate-900"
                      />
                      <Truck className="w-4 h-4 text-slate-700" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Thanh toán khi nhận hàng (COD)</span>
                        <span className="text-slate-500 text-[11px]">Kiểm tra hàng thoải mái trước khi thanh toán</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'vietqr' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vietqr"
                        checked={formData.paymentMethod === 'vietqr'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'vietqr' })}
                        className="accent-slate-900"
                      />
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Chuyển khoản VietQR (Khuyên dùng)</span>
                        <span className="text-slate-500 text-[11px]">Quét mã QR qua mọi ứng dụng ngân hàng trong 3 giây</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'momo' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={formData.paymentMethod === 'momo'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'momo' })}
                        className="accent-slate-900"
                      />
                      <CreditCard className="w-4 h-4 text-pink-600" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Ví điện tử MoMo</span>
                        <span className="text-slate-500 text-[11px]">Thanh toán nhanh qua ví MoMo</span>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Order Summary Column */}
              <div className="md:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Đơn hàng ({cartItems.length} sản phẩm)
                  </h3>

                  {/* Cart Items list */}
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-2.5 items-center text-xs">
                        <img
                          src={item.product.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover rounded border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Bản {item.selectedSize} | SL: {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 text-xs">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price calc */}
                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
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
                      <span>Phí giao hàng:</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-600 font-bold">Miễn phí (Freeship)</span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t">
                      <span>Tổng thanh toán:</span>
                      <span className="text-base" style={{ color: themeColor }}>
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md transition hover:opacity-95 cursor-pointer"
                    style={{ backgroundColor: themeColor }}
                  >
                    Hoàn Tất Đặt Hàng ({formatPrice(finalTotal)})
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Bằng việc đặt hàng, bạn đồng ý với Điều khoản mua sắm của TechZone Mobile Store.
                  </p>
                </div>

              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
