import { useState, useEffect } from 'react';
import { localDb } from '../services/supabaseClient';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  image: string;
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(() => localDb.getPortfolio());

  useEffect(() => {
    localDb.setPortfolio(holdings);
  }, [holdings]);

  const addHolding = (newHolding: Holding) => {
    setHoldings((prev) => {
      const existingIdx = prev.findIndex((h) => h.id === newHolding.id);
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const totalAmount = existing.amount + newHolding.amount;
        const totalCost = existing.amount * existing.avgPrice + newHolding.amount * newHolding.avgPrice;
        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          amount: totalAmount,
          avgPrice: totalCost / totalAmount,
        };
        return updated;
      }
      return [...prev, newHolding];
    });
  };

  const editHolding = (id: string, amount: number, avgPrice: number) => {
    setHoldings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, amount, avgPrice } : h))
    );
  };

  const deleteHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  return {
    holdings,
    addHolding,
    editHolding,
    deleteHolding,
  };
}
