import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { ODD_HOUSES, EVEN_HOUSES, HOUSE_NUMBERS } from '../utils/constants';

const StatusCell: React.FC<{ houseNum: number; isDone: boolean }> = ({ houseNum, isDone }) => {
  const isDoubleHeight = houseNum === 7;
  const heightClass = isDoubleHeight ? 'h-[4.25rem]' : 'h-8';

  return (
    <div className={`${heightClass} mb-1 flex items-center justify-center text-sm font-bold rounded border transition-colors duration-300
        ${isDone 
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-sm' 
            : 'bg-white text-gray-400 border-gray-200'}`}
    >
      {houseNum}
    </div>
  );
};

const ProgressOverview: React.FC = () => {
  const { dataList } = useData();

  const completedSet = useMemo(() => {
    return new Set(dataList.map(item => item.houseNumber));
  }, [dataList]);

  const progressPercentage = useMemo(() => {
    if (HOUSE_NUMBERS.length === 0) return 0;
    return Math.round((completedSet.size / HOUSE_NUMBERS.length) * 100);
  }, [completedSet]);

  return (
    <div className="mt-8">
      <div className="bg-white rounded shadow-lg p-6">
        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">填寫進度總覽</h3>
        
        <div className="flex justify-center">
          <div className="flex gap-1 p-2 bg-orange-50 rounded-lg border border-orange-200">
            
            <div className="w-16 flex flex-col">
              <div className="h-8 mb-1 bg-gradient-to-r from-orange-300 to-amber-300 text-gray-700 font-bold flex items-center justify-center rounded text-sm shrink-0">A區</div>
              {ODD_HOUSES.map(n => (
                <StatusCell key={`odd-${n}`} houseNum={n} isDone={completedSet.has(n)} />
              ))}
            </div>

            <div className="w-16 flex flex-col">
              <div className="h-8 mb-1 bg-gradient-to-r from-orange-300 to-amber-300 text-gray-700 font-bold flex items-center justify-center rounded text-sm shrink-0">B區</div>
              {EVEN_HOUSES.map(n => (
                <StatusCell key={`even-${n}`} houseNum={n} isDone={completedSet.has(n)} />
              ))}
            </div>

            <div className="w-20 flex flex-col relative bg-orange-100 rounded overflow-hidden border border-orange-300 mx-1">
              <div className="h-8 mb-1 sticky top-0 w-full z-10 flex items-center justify-center font-bold text-gray-800 bg-white/50 backdrop-blur-sm border-b border-orange-300 text-sm shrink-0">
                {progressPercentage}%
              </div>
              
              <div className="relative w-full flex-grow">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-amber-400 progress-bar-fill shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                  style={{ height: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 bg-orange-600 rounded mr-1 align-middle"></span>已完成
          <span className="inline-block w-3 h-3 bg-white border border-gray-300 rounded ml-3 mr-1 align-middle"></span>未填寫
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
