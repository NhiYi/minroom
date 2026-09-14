import { Product } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

const CATEGORY_MAP: Record<string, { name: string; slug: string }> = {
  "men's clothing": { name: 'Thời Trang Nam', slug: 'nam' },
  "women's clothing": { name: 'Thời Trang Nữ', slug: 'nu' },
  "jewelery": { name: 'Trang Sức & Phụ Kiện', slug: 'phu-kien' },
  "electronics": { name: 'Phụ Kiện & Đồ Công Nghệ', slug: 'phu-kien' },
};

const DEFAULT_COLORS = [
  { name: 'Đen Tuyển', hex: '#1e293b' },
  { name: 'Trắng Sữa', hex: '#f8fafc' },
  { name: 'Xanh Navy', hex: '#1e3a8a' },
  { name: 'Be Cát', hex: '#d7cec7' },
];

export async function fetchFakeStoreProducts(): Promise<{ products: Product[]; categories: { id: string; name: string; count: number }[] }> {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) {
      throw new Error(`FakeStoreAPI HTTP error! status: ${res.status}`);
    }
    const data: FakeStoreProduct[] = await res.json();

    // Map FakeStore API items to rich Blocksy Product structure
    const mappedProducts: Product[] = data.map((item) => {
      const catInfo = CATEGORY_MAP[item.category] || {
        name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        slug: item.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      };

      // Convert USD price to realistic VND price (1 USD ~ 25,000 VND, rounded to nearest 1,000 VND)
      const priceVnd = Math.round((item.price * 25000) / 1000) * 1000;
      const isSale = item.id % 2 === 0;
      const originalPrice = isSale ? Math.round((priceVnd * 1.25) / 1000) * 1000 : undefined;

      const isClothing = item.category.includes('clothing');

      return {
        id: String(item.id),
        name: item.title,
        sku: `FS-${String(item.id).padStart(4, '0')}`,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: catInfo.name,
        categorySlug: catInfo.slug,
        price: priceVnd,
        originalPrice,
        rating: item.rating?.rate ?? 4.8,
        reviewCount: item.rating?.count ?? 45,
        isNew: item.id <= 4 || item.id % 3 === 0,
        isSale,
        isHot: item.id <= 8 && item.id % 2 === 1,
        images: [
          item.image,
          // Duplicate or fallback for hover view
          item.image,
        ],
        colors: DEFAULT_COLORS,
        sizes: isClothing ? ['S', 'M', 'L', 'XL', 'XXL'] : ['Freesize'],
        stock: 20 + (item.id * 7) % 35,
        description: item.description,
        material: isClothing ? '100% Cotton & Vải dệt sợi tự nhiên cao cấp' : 'Vật liệu hợp kim & da tổng hợp tinh chế',
        tags: [catInfo.name, 'FakeStoreAPI', isClothing ? 'Thời trang' : 'Phụ kiện', 'Blocksy'],
      };
    });

    // Build dynamic categories list
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
    console.warn('Could not fetch from FakeStoreAPI, falling back to local dataset:', error);
    return {
      products: FALLBACK_PRODUCTS,
      categories: [
        { id: 'all', name: 'Tất Cả Sản Phẩm', count: FALLBACK_PRODUCTS.length },
        { id: 'nam', name: 'Thời Trang Nam', count: 5 },
        { id: 'nu', name: 'Thời Trang Nữ', count: 5 },
        { id: 'ao-khoac', name: 'Áo Khoác & Blazer', count: 3 },
      ],
    };
  }
}

// Sync order / cart to FakeStoreAPI
export async function syncOrderToFakeStoreApi(cartItems: { productId: number; quantity: number }[]): Promise<boolean> {
  try {
    const res = await fetch('https://fakestoreapi.com/carts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString().split('T')[0],
        products: cartItems,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// FakeStoreAPI Authentication: Login
export async function loginToFakeStoreApi(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: { id: number | string; username: string; email: string; fullName: string }; error?: string }> {
  try {
    const res = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        token: data.token || 'demo-token-' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000) + 1,
          username: username.trim(),
          email: `${username.trim()}@example.com`,
          fullName: username.trim().charAt(0).toUpperCase() + username.trim().slice(1),
        },
      };
    } else {
      // If FakeStoreAPI rejects (e.g., custom username), provide a smooth simulated login or error
      // FakeStoreAPI only accepts specific seeded users for /auth/login like mor_2314 / 83r5^_
      // We will allow users to log in with simulated credentials if they enter their own, or inform them.
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
    // Network or offline fallback
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

// FakeStoreAPI Authentication: Register new user
export async function registerToFakeStoreApi(
  username: string,
  email: string,
  password: string,
  fullName?: string
): Promise<{ success: boolean; user?: { id: number | string; username: string; email: string; fullName: string }; error?: string }> {
  try {
    const res = await fetch('https://fakestoreapi.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        name: {
          firstname: fullName?.split(' ')[0] || username,
          lastname: fullName?.split(' ').slice(1).join(' ') || 'Customer',
        },
      }),
    });

    const data = res.ok ? await res.json().catch(() => ({})) : {};

    return {
      success: true,
      user: {
        id: data.id || Math.floor(Math.random() * 1000) + 10,
        username: username.trim(),
        email: email.trim(),
        fullName: fullName || username.trim(),
      },
    };
  } catch {
    return {
      success: true,
      user: {
        id: Math.floor(Math.random() * 1000) + 10,
        username: username.trim(),
        email: email.trim(),
        fullName: fullName || username.trim(),
      },
    };
  }
}
