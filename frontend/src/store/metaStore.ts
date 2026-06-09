import { create } from 'zustand';
import { getTags } from '../api/tags';
import { getCategories } from '../api/categories';
import type { TagVO } from '../types/tag';
import type { CategoryVO } from '../types/category';

interface MetaState {
  tags: TagVO[];
  categories: CategoryVO[];
  loaded: boolean;
  loading: boolean;
  load: () => Promise<void>;
  invalidate: () => void;
}

export const useMetaStore = create<MetaState>((set, get) => ({
  tags: [],
  categories: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const [tagsRes, catsRes] = await Promise.all([getTags(), getCategories()]);
      set({ tags: tagsRes.data ?? [], categories: catsRes.data ?? [], loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  // 写操作后调用，使缓存失效并重新加载
  invalidate: () => set({ loaded: false, tags: [], categories: [] }),
}));
