import { useState, type FormEvent } from 'react';
import { ArrowUp, Mail, Phone, MapPin, CheckCircle, Shield } from 'lucide-react';

interface FooterProps {
  themeColor: string;
}

export function Footer({ themeColor }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f172a] text-slate-400 text-xs border-t border-slate-800">
      
      {/* Multi-Widget Footer Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: About & Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                TECHZONE<span style={{ color: themeColor }}>.</span>
              </span>
              <span className="text-[10px] tracking-widest font-bold uppercase bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">
                STORE
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed pr-4 text-xs">
              Hệ thống bán lẻ điện thoại di động và phụ kiện công nghệ cao cấp chính hãng. Cam kết 100% hàng chính hãng Apple, Samsung, Oppo, Realme, Vivo nguyên seal, bảo hành 1 đổi 1 trong 30 ngày.
            </p>

            <div className="space-y-2 pt-1 text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>126 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Hotline: 1800 6868 (8:00 - 22:00 hàng ngày)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>cskh@techzone.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Thương Hiệu
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#san-pham" className="hover:text-white transition">Apple iPhone</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Samsung Galaxy</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Oppo Smartphones</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Realme & Vivo</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Tai Nghe & Sạc Nhanh</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Chương Trình Trả Góp 0%</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Chính Sách & Hỗ Trợ
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition">Chính sách bảo hành 12 tháng chính hãng</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Chính sách 1 đổi 1 trong 30 ngày</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Thu cũ đổi mới - Trợ giá đến 2 triệu</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Hướng dẫn mua hàng trả góp qua thẻ tín dụng</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Tra cứu tình trạng bảo hành máy</span></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Nhận Ưu Đãi Công Nghệ
            </h4>
            <p className="text-slate-400 text-xs">
              Đăng ký để nhận voucher giảm ngay <strong>500.000₫</strong> khi lên đời smartphone flagship và tin tức sự kiện mở bán mới.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-bold text-xs shadow transition hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                Nhận Voucher Ưu Đãi
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>Đã gửi voucher vào email của bạn!</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment icons */}
      <div className="border-t border-slate-800/80 bg-[#0b1120] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="text-slate-500 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} TechZone Mobile Store. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Hàng chính hãng phân phối tại Việt Nam, bảo hành điện tử chính hãng toàn quốc.
            </p>
          </div>

          {/* Payment Badges & Back to top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>VietQR • COD • Trả Góp 0% • Thẻ ATM</span>
            </div>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Lên đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}
