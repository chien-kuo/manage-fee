import { create } from 'zustand';

export interface PaymentData {
  id: string;
  houseNumber: number;
  opinion: string;
  updatedAt: any;
  updatedBy: string;
}

interface DataState {
  dataList: PaymentData[];
  isLoading: boolean;
  errorMsg: string | null;
  setDataList: (data: PaymentData[]) => void;
  setLoading: (loading: boolean) => void;
  setErrorMsg: (msg: string | null) => void;
}

export const useDataStore = create<DataState>((set) => ({
  dataList: [],
  isLoading: true,
  errorMsg: null,
  setDataList: (dataList) => set({ dataList }),
  setLoading: (isLoading) => set({ isLoading }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
}));
