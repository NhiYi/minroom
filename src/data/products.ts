import { Product } from '../types';

export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả Sản Phẩm', count: 12 },
  { id: 'nam', name: 'Thời Trang Nam', count: 5 },
  { id: 'nu', name: 'Thời Trang Nữ', count: 5 },
  { id: 'ao-so-mi', name: 'Áo Sơ Mi & Polo', count: 4 },
  { id: 'ao-khoac', name: 'Áo Khoác & Blazer', count: 3 },
  { id: 'quan-jeans', name: 'Quần & Trousers', count: 3 },
  { id: 'vay-dam', name: 'Váy & Đầm Liền', count: 2 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Áo Blazer Linen Phom Rộng Minimalist',
    sku: 'BL-LN-01',
    slug: 'ao-blazer-linen-phom-rong',
    category: 'Áo Khoác & Blazer',
    categorySlug: 'ao-khoac',
    price: 790000,
    originalPrice: 1050000,
    rating: 4.9,
    reviewCount: 42,
    isSale: true,
    isNew: true,
    isHot: true,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Be Khói', hex: '#d7cec7' },
      { name: 'Đen Tuyển', hex: '#212121' },
      { name: 'Xanh Rêu Nhạt', hex: '#7a8b7b' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    description: 'Chiếc blazer thiết kế theo phong cách tối giản Bắc Âu, chất liệu 100% Linen dệt tự nhiên thoáng mát, tôn dáng và mang lại nét thanh lịch không gắng gượng cho cả môi trường công sở lẫn dạo phố cuối tuần.',
    material: '100% Linen dệt mộc tự nhiên, lót lụa tơ tằm thoáng khí',
    tags: ['Blazer', 'Linen', 'Minimalism', 'Best Seller']
  },
  {
    id: 'prod-2',
    name: 'Áo Sơ Mi Oxford Dáng Relaxed Fit',
    sku: 'SM-OX-02',
    slug: 'ao-so-mi-oxford-relaxed',
    category: 'Áo Sơ Mi & Polo',
    categorySlug: 'ao-so-mi',
    price: 450000,
    originalPrice: 550000,
    rating: 4.8,
    reviewCount: 68,
    isSale: true,
    isNew: false,
    isHot: true,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620012253295-c15c429fbb41?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Trắng Sữa', hex: '#fdfbf7' },
      { name: 'Xanh Pastel', hex: '#b0c4de' },
      { name: 'Xám Khói', hex: '#8e9092' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 35,
    description: 'Áo sơ mi Oxford chất vải cotton 80s dày dặn, xử lý chống nhăn nhẹ, đường may tỉ mỉ theo tiêu chuẩn xuất khẩu Nhật Bản. Cổ áo đứng form, thích hợp phối với quần tây hoặc quần chinos.',
    material: '100% Cotton chải kỹ (Combed Cotton 80s)',
    tags: ['Sơ mi', 'Oxford', 'Nam', 'Thanh lịch']
  },
  {
    id: 'prod-3',
    name: 'Đầm Maxi Xếp Ly Thắt Eo Cổ V Nữ Tính',
    sku: 'DM-PL-03',
    slug: 'dam-maxi-xep-ly-that-eo',
    category: 'Váy & Đầm Liền',
    categorySlug: 'vay-dam',
    price: 680000,
    originalPrice: 850000,
    rating: 5.0,
    reviewCount: 31,
    isSale: true,
    isNew: true,
    isHot: false,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Kem Vani', hex: '#f5efe6' },
      { name: 'Hồng Đất', hex: '#c59b8c' },
      { name: 'Xanh Olive', hex: '#556b2f' }
    ],
    sizes: ['S', 'M', 'L'],
    stock: 12,
    description: 'Thiết kế đầm dài thắt nơ eo nữ tính, phần chân váy xếp ly tạo độ bồng bềnh tự nhiên theo từng bước đi. Thích hợp cho các buổi tiệc nhẹ, cà phê hoặc kỳ nghỉ dưỡng sang trọng.',
    material: 'Chiffon dệt lụa cao cấp, lót thun cotton 4 chiều mềm mịn',
    tags: ['Váy nữ', 'Maxi', 'Dự tiệc', 'Thời trang nữ']
  },
  {
    id: 'prod-4',
    name: 'Quần Tây Xếp Ly Ống Rộng Phong Cách Hàn Quốc',
    slug: 'quan-tay-xep-ly-wide-leg',
    sku: 'QT-WL-04',
    category: 'Quần & Trousers',
    categorySlug: 'quan-jeans',
    price: 520000,
    originalPrice: 650000,
    rating: 4.7,
    reviewCount: 53,
    isSale: true,
    isNew: false,
    isHot: true,
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Nâu Cà Phê', hex: '#4a3b32' },
      { name: 'Xám Chì', hex: '#3f4144' },
      { name: 'Đen Tuyền', hex: '#1a1a1a' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    description: 'Quần tây ống rộng với đường ly ủi chết tỉ mỉ, cạp cao tôn dáng kéo dài đôi chân. Chất vải đứng form nhưng có độ rũ tự nhiên, không bai nhão khi giặt máy.',
    material: 'Vải Tuýt-si pha sợi co giãn cao cấp, chống bám bụi',
    tags: ['Quần tây', 'Wide Leg', 'Unisex', 'Streetwear']
  },
  {
    id: 'prod-5',
    name: 'Áo Len Dệt Kim Cổ Polo Thanh Lịch',
    sku: 'AL-PL-05',
    slug: 'ao-len-det-kim-co-polo',
    category: 'Áo Sơ Mi & Polo',
    categorySlug: 'ao-so-mi',
    price: 490000,
    originalPrice: undefined,
    rating: 4.9,
    reviewCount: 27,
    isSale: false,
    isNew: true,
    isHot: false,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Xanh Navy', hex: '#001f3f' },
      { name: 'Trắng Ngà', hex: '#fffdd0' },
      { name: 'Ghi Sáng', hex: '#d3d3d3' }
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 15,
    description: 'Chiếc áo polo dệt kim mang hơi thở phong cách quý tộc "Old Money", sợi cotton modal dệt mỏng êm ái trên da, giữ nhiệt vừa phải, mặc được cả 4 mùa.',
    material: '70% Cotton Modal, 30% Silk Touch Fiber',
    tags: ['Polo', 'Dệt kim', 'Old Money']
  },
  {
    id: 'prod-6',
    name: 'Áo Khoác Denim Vintage Worn Wash',
    sku: 'AK-DN-06',
    slug: 'ao-khoac-denim-vintage',
    category: 'Áo Khoác & Blazer',
    categorySlug: 'ao-khoac',
    price: 690000,
    originalPrice: 890000,
    rating: 4.8,
    reviewCount: 76,
    isSale: true,
    isNew: false,
    isHot: true,
    images: [
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525450824786-227cbef70703?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Xanh Khói Wash', hex: '#566f81' },
      { name: 'Xanh Indigo Cổ Điển', hex: '#26435f' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    description: 'Áo khoác jeans 14oz chắc chắn, hiệu ứng sờn nhẹ thủ công mang chất bụi bặm phóng khoáng. Cúc đồng nguyên khối dập nổi tinh tế.',
    material: '100% Selvedge Heavy Denim 14oz',
    tags: ['Denim', 'Jeans', 'Vintage', 'Áo khoác']
  },
  {
    id: 'prod-7',
    name: 'Áo Thun Heavyweight Cotton 280GSM Form Boxy',
    sku: 'AT-BX-07',
    slug: 'ao-thun-heavyweight-boxy',
    category: 'Thời Trang Nam',
    categorySlug: 'nam',
    price: 290000,
    originalPrice: 350000,
    rating: 4.9,
    reviewCount: 112,
    isSale: true,
    isNew: false,
    isHot: true,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Đen Washed', hex: '#2b2b2b' },
      { name: 'Trắng Tinh', hex: '#ffffff' },
      { name: 'Xanh Rêu Đậm', hex: '#3b4d3b' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    description: 'Mẫu áo thun định lượng 280GSM dày dặn, không lộ cơ thể, bo cổ dệt dầy chống dão sau 100 lần giặt. Phom boxy hiện đại tôn dáng vai ngang.',
    material: '100% Cotton 2 chiều dày dặn',
    tags: ['T-Shirt', 'Boxy', 'Streetwear', 'Must Have']
  },
  {
    id: 'prod-8',
    name: 'Chân Váy Chữ A Lưng Cao Vải Tweed Sang Trọng',
    sku: 'CV-TW-08',
    slug: 'chan-vay-chu-a-tweed',
    category: 'Váy & Đầm Liền',
    categorySlug: 'vay-dam',
    price: 480000,
    originalPrice: 620000,
    rating: 4.7,
    reviewCount: 19,
    isSale: true,
    isNew: true,
    isHot: false,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=800&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Tweed Đen Trắng', hex: '#333333' },
      { name: 'Tweed Hồng Pastel', hex: '#e8b4b8' }
    ],
    sizes: ['S', 'M', 'L'],
    stock: 14,
    description: 'Chân váy chữ A chất liệu dạ Tweed cao cấp viền sợi kim tuyến óng ánh nhẹ, thiết kế kèm quần bảo hộ bên trong tiện lợi khi di chuyển.',
    material: 'Dạ Tweed cao cấp, lót lụa satin mềm mại',
    tags: ['Tweed', 'Chân váy', 'Công sở', 'Tiểu thư']
  }
];

export const SHIPPING_FREE_THRESHOLD = 500000; // Miễn phí vận chuyển từ 500k
export const STANDARD_SHIPPING_FEE = 30000;

export const COUPONS: Record<string, { code: string; discountPercent: number; minOrder: number; description: string }> = {
  BLOCKSY10: {
    code: 'BLOCKSY10',
    discountPercent: 10,
    minOrder: 300000,
    description: 'Giảm 10% cho đơn từ 300.000₫'
  },
  FASHION20: {
    code: 'FASHION20',
    discountPercent: 20,
    minOrder: 700000,
    description: 'Giảm 20% cho đơn từ 700.000₫'
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountPercent: 0,
    minOrder: 0,
    description: 'Miễn phí giao hàng toàn quốc'
  }
};
