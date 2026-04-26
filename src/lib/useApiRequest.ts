import { useState, useCallback } from 'react';

/**
 * Hook genérico para requisições API (GET, POST, etc).
 * Centraliza loading, erro e resposta.
 */
export function useApiRequest<T = any, P = any>(
  apiFn: (params: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (params: P) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(params);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err?.message || 'Erro inesperado');
        setData(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  return { data, error, loading, execute };
}
