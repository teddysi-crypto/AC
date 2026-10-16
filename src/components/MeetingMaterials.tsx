import React, { useState } from 'react';
import { MeetingTask } from '../types';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Users, 
  Download, 
  Plus, 
  CheckSquare, 
  Square, 
  ArrowUpRight, 
  FileCheck2, 
  Layers 
} from 'lucide-react';

interface MeetingMaterialsProps {
  tasks: MeetingTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<MeetingTask, 'id' | 'completed'>) => void;
}

export const MeetingMaterials: React.FC<MeetingMaterialsProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [selectedMeetingIndex, setSelectedMeetingIndex] = useState(0);

  const meetings = [
    {
      id: 'MTG-2026-04A',
      title: '115年度第 14 次產銷發展與供應商管理例會',
      date: '2026-04-08 09:30 - 11:30',
      location: '農產運銷總部 3F 第一會議室 / 線上同步',
      chair: '陳建國 (採購主管)',
      attendees: ['林志明 (中區專員)', '王維平 (中區專員)', '高子翔 (南區專員)', '周建華 (東區專員)', '張美琪 (食安稽核)'],
      agenda: [
        '1. 第二季有機農產品驗證證書到期盤點與催告專案 (慈耕楊文正、綠生農場等)。',
        '2. 端午檔期主力有機蔬果產出預報提早收單與冷鏈直發排程。',
        '3. 針對吳淑惠 (C級) 契約達成率低於 50% 啟動個別改善面談與輔導措施。',
        '4. 南投農產合作社夏季冷泡茶契作面積擴充會勘評估報告。',
      ],
      minutesSummary: '主席裁示：本季各區務必落實「五維度有機風險」田間巡檢，低於 30 天證書未展延者嚴格管制供貨；美濃與大湖專案持續輔導。',
      attachments: [
        { name: '115年度Q2各區有機證書效期統計表.pdf', size: '2.4 MB' },
        { name: '端午檔期主力品項契作供需預估簡報.pptx', size: '5.8 MB' },
        { name: '供應商A_B_C年度評分矩陣總表.xlsx', size: '1.2 MB' },
      ],
    },
    {
      id: 'MTG-2026-03B',
      title: '115年度第一季食安稽核與有機完整性總結會議',
      date: '2026-03-25 14:00 - 16:30',
      location: '食安品保中心 2F 會議室',
      chair: '張美琪 (食安稽核組長)',
      attendees: ['陳建國 (採購部)', '全台駐區產銷專員', '品保檢驗組全體'],
      agenda: [
        '1. 全台 28 家合作農友第一季有機農藥殘留自主快篩 0 檢出成果總結。',
        '2. 梅雨前夕防範鄰田農藥空飄與物理緩衝隔離帶稽查標準修正。',
        '3. 高風險農戶 (美濃淑惠農園) 不良品 CAPA 改善複驗進度。',
      ],
      minutesSummary: '全季抽驗樣品合格率達 98.2%，針對東側鄰田空飄風險農戶，要求4月底前完成防風黑網加裝與水路獨立檢測。',
      attachments: [
        { name: '115年Q1農藥殘留抽檢數據與檢驗報告書.pdf', size: '4.1 MB' },
        { name: '有機完整性五維度評估操作指引SOP.pdf', size: '1.8 MB' },
      ],
    },
  ];

  const currentMtg = meetings[selectedMeetingIndex];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900">
            會議資料與產發議事專區
          </span>
          <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono">
            Conference Docs
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          收錄每週產銷發展例會、採購審查會議與食安稽核會議之議程、決議事項紀錄與簡報附件。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Meeting Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase px-1">
            歷次產發與採購例會
          </div>

          <div className="space-y-2">
            {meetings.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setSelectedMeetingIndex(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMeetingIndex === idx
                    ? 'bg-amber-50/60 border-amber-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-500 font-bold">{m.id}</span>
                  <span className="text-slate-400 text-[11px]">{m.date.split(' ')[0]}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                  {m.title}
                </h3>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  主席：{m.chair} · 出席：{m.attendees.length} 人
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tasks Summary */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              產發會議交辦事項執行率
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-bold font-mono text-emerald-700">
                {tasks.filter((t) => t.completed).length} / {tasks.length}
              </span>
              <span className="text-xs text-slate-500">項已核銷完成</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((tasks.filter((t) => t.completed).length / (tasks.length || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Meeting Detail & Attachments (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>{currentMtg.id}</span>
              <span>·</span>
              <span>{currentMtg.date}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              {currentMtg.title}
            </h2>
            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>地點：</strong>{currentMtg.location}</div>
              <div><strong>會議主席：</strong>{currentMtg.chair}</div>
              <div><strong>出席專員：</strong>{currentMtg.attendees.join('、')}</div>
            </div>
          </div>

          {/* Agenda */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>會議討論議程</span>
            </h3>
            <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-700">
              {currentMtg.agenda.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Minutes Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>重要決議與主席裁示事項</span>
            </h3>
            <div className="p-3.5 bg-emerald-50/40 rounded-lg border border-emerald-100 text-xs text-slate-700 leading-relaxed">
              {currentMtg.minutesSummary}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-slate-500" />
              <span>會議資料與參考檔案下載</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentMtg.attachments.map((file, i) => (
                <div
                  key={i}
                  onClick={() => alert(`正在下載會議檔案：${file.name}`)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-800 line-clamp-1">{file.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{file.size}</div>
                    </div>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
