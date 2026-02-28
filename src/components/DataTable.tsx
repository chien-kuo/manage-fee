import React, { useMemo, useState } from 'react';
import { Loader2, ArrowUpDown, Trash2 } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useAuthStore } from '../store/useAuthStore';
import { PaymentData } from '../store/useDataStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DataTable: React.FC = () => {
  const { dataList, isLoading, deleteRows } = useData();
  const { isAdmin } = useAuthStore();
  
  const [sortKey, setSortKey] = useState<'houseNumber' | 'updatedAt'>('houseNumber');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sortedData = useMemo(() => {
    const arr = [...dataList];
    arr.sort((a, b) => {
      if (sortKey === 'houseNumber') {
        return (a.houseNumber - b.houseNumber) * sortDir;
      }
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return (aTime - bTime) * sortDir;
    });
    return arr;
  }, [dataList, sortKey, sortDir]);

  const toggleSort = (key: 'houseNumber' | 'updatedAt') => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(key === 'houseNumber' ? 1 : -1);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedData.map(i => i.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`確定要刪除 ${selectedIds.length} 筆資料嗎？`)) return;
    try {
      await deleteRows(selectedIds);
      setSelectedIds([]);
    } catch (err: any) {
      alert(`刪除失敗: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
        <p>同步資料庫中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-700">匯款時間</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{dataList.length} 筆資料</span>
          {isAdmin && selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-700 flex items-center text-sm font-bold"
            >
              <Trash2 size={16} className="mr-1" /> 刪除所選 ({selectedIds.length})
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
              {isAdmin && (
                <th className="px-6 py-3 font-semibold w-12">
                  <input 
                    type="checkbox" 
                    onChange={toggleSelectAll} 
                    checked={sortedData.length > 0 && selectedIds.length === sortedData.length} 
                  />
                </th>
              )}
              <th className="px-6 py-3 font-semibold w-1/4">
                <button onClick={() => toggleSort('houseNumber')} className="flex items-center gap-2">
                  門牌號碼
                  <ArrowUpDown size={14} className={cn(sortKey === 'houseNumber' ? "text-orange-500" : "text-gray-400")} />
                </button>
              </th>
              <th className="px-6 py-3 font-semibold">內容</th>
              {isAdmin && (
                <th className="px-6 py-3 font-semibold w-40">
                  <button onClick={() => toggleSort('updatedAt')} className="flex items-center gap-2 justify-end w-full">
                    <ArrowUpDown size={14} className={cn(sortKey === 'updatedAt' ? "text-orange-500" : "text-gray-400")} />
                    最後更新時間
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 2} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                  目前尚無資料，請成為第一位填寫者。
                </td>
              </tr>
            ) : (
              sortedData.map(item => (
                <tr key={item.id} className="hover:bg-orange-50 transition fade-in">
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)} 
                        onChange={() => toggleSelect(item.id)} 
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="inline-block bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-full text-sm">
                      {item.houseNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 break-words">{item.opinion}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-gray-600 text-sm text-right">
                      {item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleString('zh-TW') : ''}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
