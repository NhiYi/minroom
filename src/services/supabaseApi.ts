import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product, ProductColor, AuthUser, CartItem } from '../types';

// ---------------------------------------------------------------
// SẢN PHẨM
// Gộp products + product_images + product_variants + product_tags
// thành đúng shape `Product` mà UI đang dùng.
// ---------------------------------------------------------------
export async function fetchProductsFromSupabase(): Promise<{
  products: Product[];
  categories: { id: string; name: string; count: number }[];
} | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: categoriesData, error: catErr } = await supabase
      .from('categories')
      .select('id, name, slug');
    if (catErr) {
      console.warn('[supabase] Lỗi tải categories:', catErr.message);
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, sku, slug, price, original_price, rating, review_count,
        description, material, is_new, is_sale, is_hot,
        category:categories ( name, slug ),
        product_images ( url, sort_order ),
        product_variants ( id, color_name, color_hex, size, stock ),
        product_tags ( tags ( name ) )
      `);

    if (error) {
      console.warn('[supabase] Lỗi tải products:', error.message);
      return null;
    }

    const products: Product[] = (data || []).map((p: any) => {
      const images = (p.product_images || [])
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img: any) => img.url);

      const colorMap = new Map<string, ProductColor>();
      const sizeSet = new Set<string>();
      let totalStock = 0;
      (p.product_variants || []).forEach((v: any) => {
        if (v.color_name) {
          colorMap.set(v.color_name, { name: v.color_name, hex: v.color_hex || '#000000' });
        }
        if (v.size) {
          sizeSet.add(v.size);
        }
        totalStock += v.stock ?? 0;
      });

      return {
        id: String(p.id),
        name: p.name,
        sku: p.sku || `SP-${p.id}`,
        slug: p.slug || `product-${p.id}`,
        category: p.category?.name ?? 'Điện Thoại',
        categorySlug: p.category?.slug ?? 'smartphones',
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        rating: Number(p.rating ?? 5),
        reviewCount: p.review_count ?? 0,
        isNew: p.is_new ?? false,
        isSale: p.is_sale ?? false,
        isHot: p.is_hot ?? false,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'],
        colors: colorMap.size > 0 ? Array.from(colorMap.values()) : [{ name: 'Đen Không Gian', hex: '#1e293b' }],
        sizes: sizeSet.size > 0 ? Array.from(sizeSet) : ['128GB', '256GB'],
        stock: totalStock > 0 ? totalStock : 10,
        description: p.description ?? '',
        material: p.material ?? 'Khung kim loại cao cấp',
        tags: (p.product_tags || []).map((t: any) => t.tags?.name).filter(Boolean),
      };
    });

    const categories = [
      { id: 'all', name: 'Tất Cả Sản Phẩm', count: products.length },
      ...(categoriesData || []).map((c: any) => ({
        id: c.slug,
        name: c.name,
        count: products.filter((p) => p.categorySlug === c.slug).length,
      })),
    ];

    return { products, categories };
  } catch (err: any) {
    console.warn('[supabase] Exception when fetching products:', err?.message || err);
    return null;
  }
}

// ---------------------------------------------------------------
// XÁC THỰC (dùng Supabase Auth, không phải bảng `users` thủ công)
// ---------------------------------------------------------------
export async function loginWithSupabase(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { success: false, error: error?.message || 'Đăng nhập thất bại' };
    }
    return {
      success: true,
      user: {
        id: data.user.id,
        username: data.user.user_metadata?.username || data.user.email!.split('@')[0],
        email: data.user.email!,
        fullName: data.user.user_metadata?.full_name,
        token: data.session?.access_token,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối Supabase Auth' };
  }
}

export async function registerWithSupabase(
  username: string,
  email: string,
  password: string,
  fullName?: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, full_name: fullName } },
    });
    if (error || !data.user) {
      return { success: false, error: error?.message || 'Đăng ký thất bại' };
    }
    return {
      success: true,
      user: {
        id: data.user.id,
        username,
        email,
        fullName,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối đăng ký Supabase' };
  }
}

// ---------------------------------------------------------------
// GIỎ HÀNG — lưu theo variant_id (product_id + color + size)
// ---------------------------------------------------------------
export async function syncCartItemToSupabase(userId: string, variantId: number, quantity: number) {
  return supabase
    .from('cart_items')
    .upsert({ user_id: userId, variant_id: variantId, quantity }, { onConflict: 'user_id,variant_id' });
}

export async function removeCartItemFromSupabase(userId: string, variantId: number) {
  return supabase.from('cart_items').delete().eq('user_id', userId).eq('variant_id', variantId);
}

// ---------------------------------------------------------------
// WISHLIST
// ---------------------------------------------------------------
export async function addWishlistItemToSupabase(userId: string, productId: string) {
  return supabase.from('wishlist_items').upsert({ user_id: userId, product_id: productId });
}

export async function removeWishlistItemFromSupabase(userId: string, productId: string) {
  return supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId);
}

// ---------------------------------------------------------------
// ĐẶT HÀNG — tạo order + order_items trong 1 lượt gọi
// ---------------------------------------------------------------
export async function createOrderInSupabase(orderData: {
  userId?: string | null;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: 'cod' | 'vietqr' | 'momo';
  totalAmount: number;
  items: CartItem[];
}): Promise<{ success: boolean; orderId?: number; error?: string }> {
  try {
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId ?? null,
        full_name: orderData.fullName,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        note: orderData.note,
        payment_method: orderData.paymentMethod,
        status: 'pending',
        total_amount: orderData.totalAmount,
      })
      .select('id')
      .single();

    if (orderErr || !order) {
      return { success: false, error: orderErr?.message || 'Không tạo được đơn hàng' };
    }

    const orderItemsPayload = orderData.items.map((item) => ({
      order_id: order.id,
      product_name: item.product.name,
      sku: item.product.sku,
      size: item.selectedSize,
      color_name: item.selectedColor.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsPayload);
    if (itemsErr) {
      return { success: false, error: itemsErr.message };
    }

    return { success: true, orderId: order.id };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi lưu đơn hàng Supabase' };
  }
}
