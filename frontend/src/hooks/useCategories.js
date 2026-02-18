/**
 * useCategories Hook
 * Manages category fetching and state
 */

import { useState, useEffect } from 'react';
import ApiService from '../services/api.service';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

export default useCategories;

