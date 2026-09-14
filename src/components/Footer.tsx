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
      
      {/* 4-Widget Area - Classic Blocksy Footer Builder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: About & Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                BLOCKSY<span style={{ color: themeColor }}>.</span>
              </span>
              <span className="text-[10px] tracking-widest font-bold uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                ATELIER
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed pr-4 text-xs">
              Thương hiệu thời trang tối giản thiết kế trên nền tảng <strong>WordPress Blocksy</strong>. Tôn vinh vẻ đẹp tự nhiên qua chất liệu vải tự nhiên cao cấp và đường cắt may tinh gọn chuẩn phom dáng Á Đông.
            </p>

            <div className="space-y-2 pt-1 text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>126 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Hotline: 1900 6868 (8:00 - 22:00 hàng ngày)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>support@blocksyfashion.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Khám Phá
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#san-pham" className="hover:text-white transition">Tất Cả Sản Phẩm</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Bộ Sưu Tập Mới</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Áo Sơ Mi & Blazer</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Đầm Maxi Nữ</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Lookbook Xuân Hè</a></li>
              <li><a href="#san-pham" className="hover:text-white transition">Góc Khuyến Mãi Hot</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition">Chính sách đổi trả trong 30 ngày</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Hướng dẫn chọn bảng size chuẩn</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Phương thức giao hàng & Thanh toán</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Chính sách bảo mật thông tin</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Tra cứu mã vận đơn bưu điện</span></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Đăng Ký Nhận Tin Blocksy
            </h4>
            <p className="text-slate-400 text-xs">
              Đăng ký để nhận voucher giảm ngay <strong>10%</strong> cho đơn hàng đầu tiên và tin tức bộ sưu tập mới.
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
                className="w-full py-2.5 rounded-lg text-white font-bold text-xs shadow transition hover:opacity-90"
                style={{ backgroundColor: themeColor }}
              >
                Nhận Mã Giảm 10%
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>Đã gửi mã ưu đãi vào email của bạn!</span>
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
              © {new Date().getFullYear()} Blocksy Fashion Store. Thiết kế giao diện WordPress Blocksy WooCommerce Theme.
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              100% hình ảnh thực tế chất lượng cao, tối ưu hiển thị trên mọi thiết bị.
            </p>
          </div>

          {/* Payment Badges & Back to top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>VietQR • COD • MoMo • ATM</span>
            </div>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
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
