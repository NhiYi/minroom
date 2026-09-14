import { ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface LookbookSectionProps {
  onQuickView: (product: Product) => void;
  products: Product[];
  themeColor: string;
}

export function LookbookSection({ onQuickView, products, themeColor }: LookbookSectionProps) {
  const look1Product = products[0]; // Linen Blazer
  const look2Product = products[2]; // Maxi dress
  const look3Product = products[1]; // Oxford shirt

  return (
    <section className="bg-white py-16 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            BLOCKSY EDITORIAL LOOKBOOK
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Gợi Ý Phối Đồ & Phong Cách Sống
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Khám phá cách các stylist Blocksy phối trang phục hàng ngày đơn giản mà vẫn nổi bật nét tinh tế, sang trọng.
          </p>
        </div>

        {/* 3-Column Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div
            onClick={() => look1Product && onQuickView(look1Product)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
              alt="Lookbook 1"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                LOOK 01 • MINIMALIST
              </span>
              <h3 className="text-lg font-bold mt-1">Thanh Lịch Công Sở Hiện Đại</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Kết hợp Blazer Linen phom rộng và quần âu xếp ly cho cảm giác thoải mái cả ngày.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold underline underline-offset-4 group-hover:text-amber-300 transition flex items-center gap-1">
                  Xem set đồ này <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                  790.000₫
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => look2Product && onQuickView(look2Product)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Lookbook 2"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                LOOK 02 • FEMININE CHIC
              </span>
              <h3 className="text-lg font-bold mt-1">Dịu Dàng Buổi Trà Chiều</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Váy maxi xếp ly chất vải chiffon nhẹ bẫng, tôn vinh nét nữ tính tự nhiên của phái đẹp.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold underline underline-offset-4 group-hover:text-emerald-300 transition flex items-center gap-1">
                  Xem set đồ này <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                  680.000₫
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => look3Product && onQuickView(look3Product)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
              alt="Lookbook 3"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300">
                LOOK 03 • SMART CASUAL
              </span>
              <h3 className="text-lg font-bold mt-1">Phóng Khoáng Dạo Phố Cuối Tuần</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Áo sơ mi Oxford chất cotton 80s mặc layer cùng áo thun trắng trơn tinh khôi.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold underline underline-offset-4 group-hover:text-sky-300 transition flex items-center gap-1">
                  Xem set đồ này <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                  450.000₫
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
