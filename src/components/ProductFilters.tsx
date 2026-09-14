import { type ChangeEvent } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { FilterState } from '../types';
import { formatPrice } from '../utils/format';

interface ProductFiltersProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  totalProducts: number;
  availableSizes: string[];
  themeColor: string;
  categories?: { id: string; name: string; count: number }[];
}

export function ProductFilters({
  filter,
  onFilterChange,
  totalProducts,
  availableSizes,
  themeColor,
  categories = CATEGORIES,
}: ProductFiltersProps) {
  const handleCategoryChange = (catId: string) => {
    onFilterChange({ ...filter, category: catId });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      sortBy: e.target.value as FilterState['sortBy'],
    });
  };

  const handleSizeToggle = (size: string) => {
    const exists = filter.selectedSizes.includes(size);
    const newSizes = exists
      ? filter.selectedSizes.filter((s) => s !== size)
      : [...filter.selectedSizes, size];
    onFilterChange({ ...filter, selectedSizes: newSizes });
  };

  const handleResetFilters = () => {
    onFilterChange({
      category: 'all',
      minPrice: 0,
      maxPrice: 1500000,
      selectedSizes: [],
      selectedColors: [],
      sortBy: 'default',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filter.category !== 'all' ||
    filter.selectedSizes.length > 0 ||
    filter.maxPrice < 1500000 ||
    filter.searchQuery.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Filter Bar with Blocksy Layout: Count & Sort */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span>
            Hiển thị <strong>{totalProducts}</strong> sản phẩm thời trang
          </span>
          {filter.searchQuery && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
              Từ khóa: &quot;{filter.searchQuery}&quot;
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Sắp xếp theo:
          </span>
          <select
            value={filter.sortBy}
            onChange={handleSortChange}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          >
            <option value="default">Thứ tự mặc định (Blocksy)</option>
            <option value="popular">Phổ biến & Bán chạy</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Category Pills (Blocksy Archive Categories Filter) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filter.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={{ backgroundColor: isActive ? themeColor : undefined }}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 whitespace-nowrap flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>

      {/* Interactive Size & Price Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Size Selection */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Kích cỡ (Size)
          </span>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = filter.selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition flex items-center justify-center border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Price Range Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Khoảng giá tối đa
            </span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
              Dưới {formatPrice(filter.maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min="300000"
            max="1500000"
            step="50000"
            value={filter.maxPrice}
            onChange={(e) =>
              onFilterChange({ ...filter, maxPrice: Number(e.target.value) })
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>300.000₫</span>
            <span>1.500.000₫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
