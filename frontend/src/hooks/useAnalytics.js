import { useState, useEffect } from 'react';
import { paperService } from '../services/paperService';

export function useAnalytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        const res = await paperService.getAnalytics();
        if (active) {
          if (res.success) {
            setData(res.data);
          } else {
            throw new Error(res.error || 'Failed to fetch analytics');
          }
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchAnalytics();
    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}
