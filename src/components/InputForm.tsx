import React, { useState } from 'react';
import { Landmark, ChevronDown, Send, Loader2 } from 'lucide-react';
import { HOUSE_NUMBERS } from '../utils/constants';
import { useData } from '../hooks/useData';

const InputForm: React.FC = () => {
  const { submitPayment } = useData();
  const [selectedHouse, setSelectedHouse] = useState(HOUSE_NUMBERS[0]);
  const [submitting, setSubmitting] = useState(false);

  // Time state
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [hour, setHour] = useState(new Date().getHours());
  const [minute, setMinute] = useState(new Date().getMinutes());

  // Payment info state
  const [bankName, setBankName] = useState('');
  const [lastFiveDigits, setLastFiveDigits] = useState('');

  const getMonthOptions = () => {
    const current = new Date().getMonth() + 1;
    const last = current === 1 ? 12 : current - 1;
    return [last, current];
  };

  const getDayOptions = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // 取得選中月份的最大天數
    const targetYear = (currentMonth === 1 && month === 12) ? currentYear - 1 : currentYear;
    const lastDayOfMonth = new Date(targetYear, month, 0).getDate();
    
    if (month === currentMonth) {
      // 當月：顯示 1 號到今天
      return Array.from({ length: now.getDate() }, (_, i) => i + 1);
    } else {
      // 往月：顯示該月完整天數
      return Array.from({ length: lastDayOfMonth }, (_, i) => i + 1);
    }
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    
    // 檢查日期合法性：如果從 3/31 切換到 2 月，自動修正日期為 2/28 或 2/29
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const targetYear = (currentMonth === 1 && newMonth === 12) ? currentYear - 1 : currentYear;
    const lastDayOfNewMonth = new Date(targetYear, newMonth, 0).getDate();
    
    if (day > lastDayOfNewMonth) {
      setDay(lastDayOfNewMonth);
    }
  };

  const getHourOptions = () => Array.from({ length: 24 }, (_, i) => i);

  const getMinuteOptions = () => Array.from({ length: 60 }, (_, i) => i);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const opinion = `${month}月${day}日${hour}時${minute}分`;
      await submitPayment(selectedHouse, opinion, bankName, lastFiveDigits);
      // Reset form or show success
      setBankName('');
      setLastFiveDigits('');
      alert('資料已成功送出！');
    } catch (err: any) {
      alert(`送出失敗: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLastFiveDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setLastFiveDigits(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded shadow-sm">
        <h3 className="font-bold text-orange-800 mb-1 flex items-center">
          <Landmark size={18} className="mr-2" />匯款資訊
        </h3>
        <div className="text-gray-700 text-sm space-y-1">
          <p>銀行代碼：<span className="font-mono font-bold">808</span></p>
          <p>存戶帳號：<span className="font-mono font-bold">0369940012403</span></p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">填寫區</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-gray-600 font-medium mb-2">1. 門牌號碼</label>
          <div className="relative">
            <select 
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded p-3 appearance-none bg-orange-50 focus:outline-none focus:border-orange-500 focus:bg-white transition"
            >
              {HOUSE_NUMBERS.map(n => <option key={n} value={n}>{n} 號</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 pointer-events-none text-gray-500" size={18} />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-600 font-medium mb-2">2. 匯款時間</label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <select 
                value={month}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="flex-1 border border-gray-300 rounded p-3 bg-orange-50"
              >
                {getMonthOptions().map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="text-gray-600">月</span>
              
              <select 
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="flex-1 border border-gray-300 rounded p-3 bg-orange-50"
              >
                {getDayOptions().map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className="text-gray-600">日</span>
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value))}
                className="flex-1 border border-gray-300 rounded p-3 bg-orange-50"
              >
                {getHourOptions().map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="text-gray-600">時</span>
              
              <select 
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value))}
                className="flex-1 border border-gray-300 rounded p-3 bg-orange-50"
              >
                {getMinuteOptions().map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="text-gray-600">分</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">3. 匯款資訊</label>
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="轉帳銀行 (例如：玉山銀行)"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 bg-orange-50 focus:outline-none focus:border-orange-500 focus:bg-white transition"
            />
            <input 
              type="text"
              inputMode="numeric"
              placeholder="末五碼 (請輸入 5 位數字)"
              value={lastFiveDigits}
              onChange={handleLastFiveDigitsChange}
              className="w-full border border-gray-300 rounded p-3 bg-orange-50 focus:outline-none focus:border-orange-500 focus:bg-white transition"
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded hover:from-orange-600 hover:to-amber-600 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center shadow-md"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              處理中...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              送出資料
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
