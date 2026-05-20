import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 封装列表页通用的 loading / data / reload 模式。
 * fetcher 和 onError 在 hook 内部用 ref 稳定，调用方无需 useCallback 包裹。
 */
export function usePageData<T>(
  fetcher: () => Promise<{ data: T[] }>,
  onError?: (err: unknown) => void,
): {
  data: T[];
  loading: boolean;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  reload: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const reload = useCallback(() => {
    setLoading(true);
    fetcherRef.current()
      .then((r) => setData(r.data))
      .catch((err) => onErrorRef.current?.(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, setData, reload };
}
