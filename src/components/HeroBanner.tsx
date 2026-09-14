import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  themeColor: string;
}

export function HeroBanner({ onExploreClick, themeColor }: HeroBannerProps) {
  return (
    <div className="relative bg-[#f5f5f7] border-b border-slate-200 overflow-hidden">
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }}></span>
              <span>BỘ SƯU TẬP XUÂN HÈ MỚI NHẤT 2025/2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Vẻ Đẹp Thanh Lịch <br />
              <span className="italic font-serif font-normal text-slate-600">
                Từ Phong Cách Tối Giản.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Trải nghiệm thời trang cao cấp trên nền tảng giao diện <strong>Blocksy WooCommerce</strong> siêu mượt. Từng đường may, chất liệu Linen và Cotton tự nhiên mang đến sự tự tin tuyệt đối cho ngày mới của bạn.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group transform active:scale-95"
                style={{ backgroundColor: themeColor }}
              >
                <span>Khám Phá Cửa Hàng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <a
                href="#san-pham"
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition shadow-sm"
              >
                Xem Sản Phẩm Bán Chạy
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 max-w-md">
              <div>
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Cotton & Linen Hữu Cơ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">4.9/5 ★</div>
                <div className="text-xs text-slate-500 font-medium">Đánh giá từ khách hàng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">24 Giờ</div>
                <div className="text-xs text-slate-500 font-medium">Giao hàng toàn quốc</div>
              </div>
            </div>
          </div>

          {/* Editorial Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image with Blocksy Styled Framing */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                  alt="Thời trang Blocksy Minimalist"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
                />
                
                {/* Floating Tag Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Bộ Sưu Tập Tiêu Biểu</div>
                    <div className="text-sm font-bold text-slate-900">Minimalist Nordic Look</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 text-white">
                    Từ 450.000₫
                  </span>
                </div>
              </div>

              {/* Floating Small Accent Card */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Khuyến Mãi Khai Trương</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Giảm đến 30% hôm nay</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Blocksy USP Bar */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Miễn Phí Giao Hàng</div>
                <div className="text-[11px] text-slate-500">Đơn hàng từ 500.000₫</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Đổi Trả Trong 30 Ngày</div>
                <div className="text-[11px] text-slate-500">Đổi size tận nơi miễn phí</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Cam Kết Chất Lượng</div>
                <div className="text-[11px] text-slate-500">100% chính hãng tuyển chọn</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Thanh Toán An Toàn</div>
                <div className="text-[11px] text-slate-500">COD, VietQR hoặc Thẻ ATM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
