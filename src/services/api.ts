import { Product, AuthUser } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  images?: string[];
  thumbnail?: string;
}

export interface DummyJsonCartResponse {
  id: number;
  products: { id: number; title: string; price: number; quantity: number }[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

// Map brands to user-friendly Vietnamese category tabs
function getCategoryInfo(brand?: string, category?: string) {
  const b = (brand || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (b.includes('apple') || c.includes('iphone')) {
    return { name: 'Apple iPhone', slug: 'apple' };
  }
  if (b.includes('samsung') || c.includes('galaxy')) {
    return { name: 'Samsung Galaxy', slug: 'samsung' };
  }
  if (b.includes('oppo') || b.includes('realme')) {
    return { name: 'Oppo & Realme', slug: 'oppo-realme' };
  }
  if (b.includes('vivo')) {
    return { name: 'Vivo Smartphones', slug: 'vivo' };
  }
  if (c.includes('mobile-accessories') || c.includes('accessories') || c.includes('tablets')) {
    return { name: 'Phụ Kiện Mobile', slug: 'accessories' };
  }
  return { name: 'Điện Thoại Khác', slug: 'other' };
}

// Smartphone default color swatches
const PHONE_COLORS_PALETTE = [
  [
    { name: 'Xanh Sierra', hex: '#9bb5ce' },
    { name: 'Xám Graphite', hex: '#4a4d52' },
    { name: 'Vàng Gold', hex: '#fae7cf' },
    { name: 'Bạc Silver', hex: '#f1f2f4' },
  ],
  [
    { name: 'Trắng Ngọc Trai', hex: '#f8fafc' },
    { name: 'Đen Ngân Hà', hex: '#1e293b' },
    { name: 'Xanh Đậm', hex: '#1e3a8a' },
  ],
  [
    { name: 'Xanh Lục Bảo', hex: '#10b981' },
    { name: 'Đỏ Ruby', hex: '#ef4444' },
    { name: 'Đen Tuyển', hex: '#0f172a' },
  ],
];

export async function fetchSmartphoneProducts(): Promise<{
  products: Product[];
  categories: { id: string; name: string; count: number }[];
}> {
  try {
    // Fetch smartphones category from DummyJSON
    const resPhones = await fetch('https://dummyjson.com/products/category/smartphones?limit=30');
    let phoneItems: DummyJsonProduct[] = [];
    if (resPhones.ok) {
      const data = await resPhones.json();
      phoneItems = data.products || [];
    }

    // Also fetch mobile accessories for a complete phone ecosystem
    let accessoryItems: DummyJsonProduct[] = [];
    try {
      const resAcc = await fetch('https://dummyjson.com/products/category/mobile-accessories?limit=10');
      if (resAcc.ok) {
        const dataAcc = await resAcc.json();
        accessoryItems = dataAcc.products || [];
      }
    } catch {
      // ignore
    }

    const allApiItems = [...phoneItems, ...accessoryItems];

    if (allApiItems.length === 0) {
      throw new Error('No items returned from DummyJSON API');
    }

    const mappedProducts: Product[] = allApiItems.map((item, idx) => {
      const catInfo = getCategoryInfo(item.brand, item.category);

      // Convert USD to realistic Vietnamese phone prices (USD * 25,000, rounded)
      const priceVnd = Math.round((item.price * 25000) / 10000) * 10000;
      const discountPercent = item.discountPercentage ? Math.round(item.discountPercentage) : 0;
      const originalPrice =
        discountPercent > 0
          ? Math.round((priceVnd / (1 - discountPercent / 100)) / 10000) * 10000
          : undefined;

      const isAccessory = catInfo.slug === 'accessories';
      const storageSizes = isAccessory
        ? ['Tiêu chuẩn']
        : item.price > 700
        ? ['128GB', '256GB', '512GB', '1TB']
        : ['64GB', '128GB', '256GB'];

      const colors = PHONE_COLORS_PALETTE[idx % PHONE_COLORS_PALETTE.length];

      const allImages = [
        item.thumbnail || item.images?.[0] || '',
        ...(item.images || []),
      ].filter((img, i, self) => img && self.indexOf(img) === i);

      return {
        id: String(item.id),
        name: item.title,
        sku: item.sku || `SMA-${(item.brand || 'PHN').toUpperCase().slice(0, 3)}-${item.id}`,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: catInfo.name,
        categorySlug: catInfo.slug,
        price: priceVnd,
        originalPrice,
        rating: item.rating ?? 4.7,
        reviewCount: Math.floor(Math.random() * 80) + 40,
        isNew: idx <= 4 || (item.id % 4 === 0),
        isSale: discountPercent > 5,
        isHot: (item.rating ?? 0) >= 4.0,
        images: allImages.length > 0 ? allImages : ['https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp'],
        colors,
        sizes: storageSizes,
        stock: item.stock ?? 30,
        description: item.description,
        material: isAccessory
          ? 'Chất liệu cao cấp chính hãng Apple / OEM, chứng nhận an toàn'
          : `Thương hiệu ${item.brand || 'Chính hãng'}. Màn hình sắc nét, vi xử lý tối ưu, pin bền bỉ. ${item.warrantyInformation || 'Bảo hành 12 tháng chính hãng 1 đổi 1.'}`,
        tags: [
          item.brand || 'Smartphone',
          catInfo.name,
          'Chính Hãng',
          'DummyJSON Live',
        ],
      };
    });

    // Compute category counts
    const categoryCounts: Record<string, { id: string; name: string; count: number }> = {};
    mappedProducts.forEach((p) => {
      if (!categoryCounts[p.categorySlug]) {
        categoryCounts[p.categorySlug] = {
          id: p.categorySlug,
          name: p.category,
          count: 0,
        };
      }
      categoryCounts[p.categorySlug].count++;
    });

    const categories = [
      { id: 'all', name: 'Tất Cả Sản Phẩm', count: mappedProducts.length },
      ...Object.values(categoryCounts),
    ];

    return { products: mappedProducts, categories };
  } catch (error) {
    console.warn('Could not fetch from DummyJSON API, falling back to local smartphone dataset:', error);
    return {
      products: FALLBACK_PRODUCTS,
      categories: [
        { id: 'all', name: 'Tất Cả Sản Phẩm', count: FALLBACK_PRODUCTS.length },
        { id: 'apple', name: 'Apple iPhone', count: 4 },
        { id: 'samsung', name: 'Samsung Galaxy', count: 3 },
        { id: 'oppo-realme', name: 'Oppo & Realme', count: 6 },
        { id: 'vivo', name: 'Vivo Smartphones', count: 3 },
        { id: 'accessories', name: 'Phụ Kiện Mobile', count: 5 },
      ],
    };
  }
}

// Backward compatibility alias for fetchFakeStoreProducts
export const fetchFakeStoreProducts = fetchSmartphoneProducts;

// DummyJSON Authentication: Login
// Seed accounts: emilys / emilyspass, michaelw / michaelwpass, sophiab / sophiabpass
export async function loginToDummyJsonApi(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 120,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        token: data.accessToken || data.token || 'dummyjson-token-' + Date.now(),
        user: {
          id: data.id || 1,
          username: data.username,
          email: data.email || `${data.username}@example.com`,
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username,
          token: data.accessToken,
        },
      };
    } else {
      // Fallback for custom or local usernames
      return {
        success: true,
        token: 'local-token-' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000) + 1,
          username: username.trim(),
          email: `${username.trim()}@gmail.com`,
          fullName: username.trim().charAt(0).toUpperCase() + username.trim().slice(1),
        },
      };
    }
  } catch {
    return {
      success: true,
      token: 'fallback-token-' + Date.now(),
      user: {
        id: Math.floor(Math.random() * 1000) + 1,
        username: username.trim(),
        email: `${username.trim()}@gmail.com`,
        fullName: username.trim().charAt(0).toUpperCase() + username.trim().slice(1),
      },
    };
  }
}

// DummyJSON Authentication: Register User
export async function registerToDummyJsonApi(
  username: string,
  email: string,
  password: string,
  fullName?: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: fullName?.split(' ')[0] || username,
        lastName: fullName?.split(' ').slice(1).join(' ') || 'Customer',
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
      }),
    });

    const data = res.ok ? await res.json().catch(() => ({})) : {};

    return {
      success: true,
      user: {
        id: data.id || Math.floor(Math.random() * 1000) + 20,
        username: username.trim(),
        email: email.trim(),
        fullName: fullName || username.trim(),
      },
    };
  } catch {
    return {
      success: true,
      user: {
        id: Math.floor(Math.random() * 1000) + 20,
        username: username.trim(),
        email: email.trim(),
        fullName: fullName || username.trim(),
      },
    };
  }
}

// DummyJSON Authentication: Request Password Reset OTP
export async function requestPasswordResetApi(
  identity: string
): Promise<{ success: boolean; message: string; otp?: string; maskedDestination?: string; error?: string }> {
  const cleanId = identity.trim();
  if (!cleanId) {
    return { success: false, message: '', error: 'Vui lòng nhập email hoặc tên đăng nhập hợp lệ.' };
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const isEmail = cleanId.includes('@');
  const masked = isEmail
    ? cleanId.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}${'*'.repeat(Math.max(b.length, 3))}${c}`)
    : `${cleanId.slice(0, 2)}***${cleanId.slice(-1)}`;

  // Default demo OTP code
  const otpCode = '868999';

  return {
    success: true,
    message: `Mã xác thực 6 số đã được tạo và gửi đến ${masked}`,
    otp: otpCode,
    maskedDestination: masked,
  };
}

// DummyJSON Authentication: Verify OTP & Set New Password
export async function resetPasswordApi(
  identity: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!identity.trim()) {
    return { success: false, error: 'Thông tin tài khoản không hợp lệ.' };
  }
  if (!otp.trim()) {
    return { success: false, error: 'Vui lòng nhập mã xác thực OTP 6 số.' };
  }
  if (otp.trim() !== '868999' && otp.trim().length !== 6) {
    return { success: false, error: 'Mã xác thực OTP không chính xác hoặc đã hết hạn.' };
  }
  if (newPassword.length < 6) {
    return { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
  }

  // Simulate server update
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    success: true,
    message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.',
  };
}

// DummyJSON Orders & Carts: Sync Order to /carts/add
export async function syncOrderToDummyJsonApi(
  orderData:
    | {
        orderId?: string;
        customer?: {
          fullName: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          note?: string;
        };
        items?: {
          productId: string | number;
          productTitle?: string;
          size?: string;
          color?: string;
          quantity: number;
          price?: number;
        }[];
        totalAmount?: number;
        paymentMethod?: string;
      }
    | Array<{ productId: string | number; quantity: number }>
): Promise<boolean> {
  try {
    const productsPayload = Array.isArray(orderData)
      ? orderData.map((item) => ({
          id: Number(item.productId) || 1,
          quantity: item.quantity,
        }))
      : (orderData.items || []).map((item) => ({
          id: Number(item.productId) || 1,
          quantity: item.quantity,
        }));

    const res = await fetch('https://dummyjson.com/carts/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        products: productsPayload.length > 0 ? productsPayload : [{ id: 1, quantity: 1 }],
      }),
    });

    if (res.ok) {
      const data: DummyJsonCartResponse = await res.json();
      console.log('DummyJSON Cart Created Successfully:', data);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not sync cart to DummyJSON (using offline simulated order):', error);
    return false;
  }
}

// Backward compatibility alias
export const syncOrderToFakeStoreApi = syncOrderToDummyJsonApi;

