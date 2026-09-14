import { ArrowUpRight, Cpu, Sparkles, Zap } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface LookbookSectionProps {
  onQuickView: (product: Product) => void;
  products: Product[];
  themeColor: string;
}

export function LookbookSection({ onQuickView, products }: LookbookSectionProps) {
  // Find notable flagship phones from the products array
  const phone1 = products.find(p => p.id === 'phone-1') || products[0]; // iPhone 13 Pro
  const phone2 = products.find(p => p.id === 'phone-4') || products[3] || products[1]; // Galaxy S10
  const phone3 = products.find(p => p.id === 'acc-1') || products[6] || products[2]; // AirPods Max

  return (
    <section className="bg-white py-16 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 font-semibold">
            TECH SHOWCASE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hệ Sinh Thái Thiết Bị & Trải Nghiệm Đẳng Cấp
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Khám phá những thiết bị công nghệ tiên phong mang lại hiệu năng vượt bậc, thiết kế hoàn mỹ và trải nghiệm kết nối không giới hạn.
          </p>
        </div>

        {/* 3-Column Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 - iPhone */}
          <div
            onClick={() => phone1 && onQuickView(phone1)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp"
              alt="Apple iPhone Ecosystem"
              className="w-full h-full object-contain p-8 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                FLAGSHIP 01 • APPLE IPHONE
              </span>
              <h3 className="text-lg font-bold mt-1">iPhone 13 Pro Max</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Chip A15 Bionic, màn hình Super Retina XDR với tần số quét 120Hz ProMotion đỉnh cao.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold underline underline-offset-4 group-hover:text-blue-300 transition flex items-center gap-1">
                  Xem chi tiết cấu hình <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md font-semibold">
                  {phone1 ? formatPrice(phone1.price) : '27.490.000₫'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 - Samsung Galaxy */}
          <div
            onClick={() => phone2 && onQuickView(phone2)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp"
              alt="Samsung Galaxy"
              className="w-full h-full object-contain p-8 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                FLAGSHIP 02 • SAMSUNG GALAXY
              </span>
              <h3 className="text-lg font-bold mt-1">Samsung Galaxy Flagship</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Màn hình Dynamic AMOLED chuẩn điện ảnh cùng camera chụp đêm sắc nét đỉnh cao.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold underline underline-offset-4 group-hover:text-amber-300 transition flex items-center gap-1">
                  Xem chi tiết cấu hình <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md font-semibold">
                  {phone2 ? formatPrice(phone2.price) : '14.990.000₫'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 - Accessories */}
          <div
            onClick={() => phone3 && onQuickView(phone3)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop"
              alt="Tech Accessories Ecosystem"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                ECOSYSTEM 03 • PHỤ KIỆN MOBILE
              </span>
              <h3 className="text-lg font-bold mt-1">Smartwatch & Audio Đỉnh Cao</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Tai nghe chống ồn chủ động, sạc nhanh MagSafe và đồng hồ thông minh đồng hành mỗi ngày.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold underline underline-offset-4 group-hover:text-emerald-300 transition flex items-center gap-1">
                  Xem chi tiết hệ sinh thái <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md font-semibold">
                  {phone3 ? formatPrice(phone3.price) : '13.490.000₫'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
