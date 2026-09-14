import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award, Smartphone } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  themeColor: string;
}

export function HeroBanner({ onExploreClick, themeColor }: HeroBannerProps) {
  return (
    <div className="relative bg-[#f5f5f7] border-b border-slate-200 overflow-hidden">
      {/* Editorial Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }}></span>
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>SIÊU PHẨM SMARTPHONE & CÔNG NGHỆ CHÍNH HÃNG 2025/2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Đỉnh Cao Công Nghệ <br />
              <span className="italic font-serif font-normal text-slate-600">
                Trải Nghiệm Đột Phá.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Khám phá các dòng điện thoại thông minh hàng đầu từ <strong>Apple iPhone, Samsung Galaxy, Oppo, Realme, Vivo</strong> chính hãng. Bảo hành 12 tháng 1 đổi 1, giao hàng hỏa tốc toàn quốc.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group transform active:scale-95 cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                <span>Khám Phá Cửa Hàng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <a
                href="#san-pham"
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition shadow-sm"
              >
                Xem Điện Thoại Bán Chạy
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 max-w-md">
              <div>
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Chính Hãng Nguyên Seal</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">4.9/5 ★</div>
                <div className="text-xs text-slate-500 font-medium">Hơn 12.000 đánh giá</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">1 Đổi 1</div>
                <div className="text-xs text-slate-500 font-medium">30 ngày lỗi phần cứng</div>
              </div>
            </div>
          </div>

          {/* Editorial Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Framing */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-6">
                <img
                  src="https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp"
                  alt="Flagship Smartphone"
                  className="w-full h-auto max-h-[85%] object-contain group-hover:scale-105 transition duration-700 ease-out drop-shadow-2xl"
                />
                
                {/* Floating Tag Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Siêu Phẩm Flagship</div>
                    <div className="text-sm font-bold text-slate-900">iPhone 13 Pro Max Sierra Blue</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 text-white">
                    Từ 27.490.000₫
                  </span>
                </div>
              </div>

              {/* Floating Small Accent Card */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Thu Cũ Đổi Mới Trợ Giá 2 Triệu</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Tặng kèm sạc nhanh 20W</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* USP Bar */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Giao Hỏa Tốc 2H</div>
                <div className="text-[11px] text-slate-500">Miễn phí nội thành từ 500k</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">1 Đổi 1 Trong 30 Ngày</div>
                <div className="text-[11px] text-slate-500">Bảo hành 12 tháng chính hãng</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Cam Kết Chính Hãng</div>
                <div className="text-[11px] text-slate-500">100% nguyên seal mới</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Thanh Toán An Toàn</div>
                <div className="text-[11px] text-slate-500">COD, VietQR hoặc Trả góp 0%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
