import React, { useState } from 'react';
import { 
  Supplier, 
  SupervisorAnnouncement, 
  MeetingTask, 
  AdminFormRecord, 
  FieldReportRecord 
} from '../types';
import { 
  Bell, 
  CheckCircle, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  AlertTriangle, 
  FileText, 
  Sprout, 
  Search, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Layers 
} from 'lucide-react';

interface PortalHomeProps {
  suppliers: Supplier[];
  announcements: SupervisorAnnouncement[];
  tasks: MeetingTask[];
  forms: AdminFormRecord[];
  fieldReports: FieldReportRecord[];
  onNavigate: (tabId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  suppliers,
  announcements,
  tasks,
  forms,
  fieldReports,
  onNavigate,
  onToggleTask,
}) => {
  const [isBulletinExpanded, setIsBulletinExpanded] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const draftFormsCount = forms.filter((f) => f.status === 'draft').length;
  const urgentCertsCount = suppliers.flatMap((s) => s.certificates).filter((c) => c.daysRemaining <= 30).length;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      
      {/* Title strictly matching the uploaded sketch */}
      <div className="text-center sm:text-left pt-2 pb-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
          多功能webapp介面
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          綠源農產供應鏈系統 · 跨部門與現場專員單一作業入口
        </p>
      </div>

      {/* Block 1: 公告事項 (Soft Blue/Lavender Bar matching image) */}
      <div className="bg-[#e2e8f0]/80 hover:bg-[#dbe4f0] border border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
        <div 
          onClick={() => setIsBulletinExpanded(!isBulletinExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 block">
                公告事項
              </span>
              <span className="text-xs text-slate-600">
                最新政策通報 · 證書到期提醒 ({urgentCertsCount} 件即期/逾期)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-blue-900 bg-white/70 px-2 py-0.5 rounded border border-blue-200">
              {announcements.length} 則公告
            </span>
            <button className="text-xs text-slate-600 hover:text-slate-900 font-medium">
              {isBulletinExpanded ? '收合 ▲' : '展開詳情 ▼'}
            </button>
          </div>
        </div>

        {/* Expandable Bulletin Content */}
        {isBulletinExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-300/60 space-y-2.5 animate-fade-in text-xs">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3 bg-white/90 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-rose-100 text-rose-800">
                      {ann.priority === 'urgent' ? '緊急督導' : '政策公告'}
                    </span>
                    <span className="font-bold text-slate-900">{ann.title}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{ann.content}</p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  {ann.date} · {ann.author}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-1">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-blue-800 hover:underline flex items-center gap-1"
              >
                <span>前往完整儀表板與證書警示總覽</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Block 2: 工作追蹤 (Soft Peach/Apricot Bar matching image) */}
      <div className="bg-[#ffedd5]/80 hover:bg-[#ffe4c7] border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
        <div 
          onClick={() => setIsTasksExpanded(!isTasksExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-amber-600 text-white rounded-lg shadow-xs">
              <CheckCircle className="w-4 h-4" />
            </span>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 block">
                工作追蹤
              </span>
              <span className="text-xs text-slate-600">
                產發會議交辦事項 · 專員點選完成即時核銷
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-white/70 px-2 py-0.5 rounded border border-amber-200">
              已完成 {completedTasksCount} / {tasks.length} 項
            </span>
            <button className="text-xs text-slate-600 hover:text-slate-900 font-medium">
              {isTasksExpanded ? '收合 ▲' : '展開追蹤 ▼'}
            </button>
          </div>
        </div>

        {/* Expandable Tasks Checklist */}
        {isTasksExpanded && (
          <div className="mt-4 pt-4 border-t border-amber-300/60 space-y-2 animate-fade-in text-xs">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  task.completed ? 'bg-white/60 border-slate-200 text-slate-400' : 'bg-white border-amber-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 hover:text-slate-600 shrink-0" />
                  )}
                  <span className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="text-[11px] font-mono shrink-0">
                  {task.completed ? (
                    <span className="text-emerald-700 font-bold">✓ 專員已完成</span>
                  ) : (
                    <span className="text-amber-800 font-medium">截止：{task.dueDate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid of 5 Functional Modules matching user sketch layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        
        {/* Card 1: 供應商資料查詢 (Row 1 Left) */}
        <button
          onClick={() => onNavigate('grading')}
          className="group bg-[#fef08a] hover:bg-[#fde047] active:scale-[0.99] border-2 border-[#facc15] rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            供應商資料
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            查詢
          </span>
          <span className="text-xs text-slate-700 font-medium mt-2 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-300">
            A/B/C 分級評分矩陣 · 28 家契作
          </span>
        </button>

        {/* Card 2: 重點品項回報 (Row 1 Right) */}
        <button
          onClick={() => onNavigate('field')}
          className="group bg-[#fef08a] hover:bg-[#fde047] active:scale-[0.99] border-2 border-[#facc15] rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            重點品項
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            回報
          </span>
          <span className="text-xs text-slate-700 font-medium mt-2 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-300">
            種植 / 產出 / 品異 5 大卡片 · 所在地導航
          </span>
        </button>

        {/* Card 3: 行政表單 (Row 2 Left) */}
        <button
          onClick={() => onNavigate('forms')}
          className="group bg-[#fef08a] hover:bg-[#fde047] active:scale-[0.99] border-2 border-[#facc15] rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            行政表單
          </span>
          <span className="text-xs text-slate-700 font-medium mt-2 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-300">
            年度評估/風險/進價異動 · 暫存與結案
          </span>
        </button>

        {/* Card 4: 資料查詢 (Row 2 Right - 有機五維度風險與法規) */}
        <button
          onClick={() => onNavigate('risk')}
          className="group bg-[#fef08a] hover:bg-[#fde047] active:scale-[0.99] border-2 border-[#facc15] rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            資料查詢
          </span>
          <span className="text-xs text-slate-700 font-medium mt-2 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-300">
            有機完整性五維度風險矩陣 (人事物地物)
          </span>
        </button>

        {/* Card 5: 會議資料 (Row 3 Left) */}
        <button
          onClick={() => onNavigate('meeting')}
          className="group bg-[#fef08a] hover:bg-[#fde047] active:scale-[0.99] border-2 border-[#facc15] rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            會議資料
          </span>
          <span className="text-xs text-slate-700 font-medium mt-2 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-300">
            產發會議紀錄 · 決議事項 · 簡報附件
          </span>
        </button>

        {/* Card 6: 儀表板總覽 (Row 3 Right) */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="group bg-[#fef08a] hover:bg-[#fde047] active:scale-[0.99] border-2 border-[#facc15] rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
        >
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide block">
            儀表板總覽
          </span>
          <span className="text-xs text-slate-700 font-medium mt-2 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-300">
            關鍵 KPI · 證書預警矩陣 · 履約達成
          </span>
        </button>
      </div>

    </div>
  );
};
