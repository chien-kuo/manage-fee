import { create } from 'zustand';

export interface PaymentData {
  id: string;
  houseNumber: number;
  opinion: string;
  bankName?: string;
  lastFiveDigits?: string;
  isReconciled?: boolean;
  updatedAt: any;
  updatedBy: string;
}

interface DataState {
  dataList: PaymentData[];
  isLoading: boolean;
  errorMsg: string | null;
  selectedIds: string[];
  setDataList: (data: PaymentData[]) => void;
  setLoading: (loading: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
  setSelectedIds: (ids: string[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  dataList: [],
  isLoading: true,
  errorMsg: null,
  selectedIds: [],
  setDataList: (dataList) => set({ dataList }),
  setLoading: (isLoading) => set({ isLoading }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  setSelectedIds: (selectedIds) => set({ selectedIds }),
}));
