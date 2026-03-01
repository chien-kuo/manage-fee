import React, { useState } from 'react';
import { Settings, FileSpreadsheet, FileText, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useAuthStore } from '../store/useAuthStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminToolbar: React.FC = () => {
  const { dataList, selectedIds, clearAllData, markAsReconciled, setSelectedIds } = useData();
  const { user } = useAuthStore();
  const [exporting, setExporting] = useState(false);
  const [reconciling, setReconciling] = useState(false);

  const handleExportCSV = () => {
    const headers = ["門牌號碼,匯款時間,轉帳銀行,末五碼,已對帳,最後更新時間"];
    const rows = dataList.map(row => {
      const time = row.updatedAt ? new Date(row.updatedAt.seconds * 1000).toLocaleString('zh-TW') : '';
      const safeOpinion = `"${row.opinion.replace(/"/g, '""')}"`;
      const safeBankName = `"${(row.bankName || '').replace(/"/g, '""')}"`;
      return `${row.houseNumber},${safeOpinion},${safeBankName},${row.lastFiveDigits || ''},${row.isReconciled ? '是' : '否'},${time}`;
    });
    const csvContent = "\uFEFF" + [headers, ...rows].join('\n'); 
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment_export_${new Date().getTime()}.csv`;
    link.click();
  };

  const handleMarkAsReconciled = async () => {
    if (selectedIds.length === 0) return;
    setReconciling(true);
    try {
      await markAsReconciled(selectedIds);
      setSelectedIds([]);
      alert("已成功更新對帳狀態");
    } catch (err: any) {
      alert("更新失敗：" + err.message);
    } finally {
      setReconciling(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const tempContainer = document.createElement('div');
    Object.assign(tempContainer.style, {
      position: 'fixed',
      left: '-9999px',
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      boxSizing: 'border-box',
      fontFamily: "'Noto Sans TC', sans-serif"
    });
    document.body.appendChild(tempContainer);

    try {
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        tempContainer.innerHTML = `
          <div style="font-size: 60px; font-weight: bold; color: #0000FF; margin-bottom: 40px; text-align: center; line-height: 1.2;">
            【 ${item.houseNumber}號 】
          </div>
          <div style="font-size: 80px; font-weight: bold; color: #000000; text-align: center; word-wrap: break-word; max-width: 170mm; line-height: 1.4;">
            ${item.opinion}
          </div>
        `;

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }
      doc.save('payment_opinions.pdf');
    } catch (err) {
      console.error(err);
      alert('PDF 匯出失敗');
    } finally {
      document.body.removeChild(tempContainer);
      setExporting(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("確定要清空所有資料嗎？此操作無法復原。")) return;
    try {
      await clearAllData();
      alert("資料庫已清空");
    } catch (err: any) {
      alert("清空失敗：" + err.message);
    }
  };

  return (
    <div className="bg-white border-l-4 border-orange-500 rounded shadow p-4 flex flex-wrap justify-between items-center gap-4 fade-in">
      <h2 className="font-bold text-gray-800 flex items-center">
        <Settings size={18} className="mr-2" />
        後台操作 ({user?.email})
      </h2>
      <div className="flex gap-3">
        {selectedIds.length > 0 && (
          <button
            onClick={handleMarkAsReconciled}
            disabled={reconciling}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 shadow flex items-center transition-all animate-in zoom-in"
            title="標記為已對帳"
          >
            {reconciling ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
          </button>
        )}

        <button
          onClick={handleExportCSV}
          disabled={dataList.length === 0}
          className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 disabled:opacity-50 shadow flex items-center"
          title="匯出 CSV"
        >
          <FileSpreadsheet size={20} />
        </button>

        <button
          onClick={handleExportPDF}
          disabled={dataList.length === 0 || exporting}
          className="bg-orange-600 text-white p-2 rounded hover:bg-orange-700 disabled:opacity-50 shadow flex items-center"
          title="匯出 PDF"
        >
          {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
        </button>

        <button
          onClick={handleClear}
          disabled={dataList.length === 0}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50 shadow flex items-center"
          title="清空資料庫"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdminToolbar;
