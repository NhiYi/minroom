import { Star, CheckCircle } from 'lucide-react';

export function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Thùy Linh',
      location: 'Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      product: 'Áo Blazer Linen Phom Rộng',
      comment: 'Chất vải linen rất mát và dày dặn, phom áo đứng cực kỳ ưng ý. Đóng gói hộp rất chỉn chu, đúng chất boutique cao cấp. Giao hàng hỏa tốc trong 2h là nhận được rồi.',
    },
    {
      id: 2,
      name: 'Minh Hoàng',
      location: 'TP. Hồ Chí Minh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      product: 'Áo Sơ Mi Oxford Relaxed Fit',
      comment: 'Áo sơ mi Oxford chất vải dệt chắc chắn, cổ áo cứng cáp không bị gãy khi giặt. Form dáng thoải mái vừa vặn, mặc đi làm cả ngày không thấy bức bối. Sẽ ủng hộ shop dài lâu!',
    },
    {
      id: 3,
      name: 'Phương Thảo',
      location: 'Đà Nẵng',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      product: 'Đầm Maxi Xếp Ly Nữ Tính',
      comment: 'Chiếc đầm đẹp hơn cả mong đợi! Từng đường dập ly đều tăm tắp, lót trong êm ái kín đáo. Mình mặc đi tiệc cưới bạn ai cũng hỏi mua ở đâu. 10/10 điểm cho chất lượng.',
    },
  ];

  return (
    <section className="bg-[#f9fafb] py-16 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Đánh Giá Từ Khách Hàng Thực Tế
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Hơn 10.000+ phản hồi 5 sao từ khách hàng yêu thích gu thời trang tối giản của Blocksy Atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{rev.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="text-[11px] text-slate-400">{rev.location}</div>
                  </div>
                </div>

                <span className="text-[10px] font-medium bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-600 truncate max-w-[120px]">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
