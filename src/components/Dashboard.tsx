import React, { useState } from 'react';
import { 
  Supplier, 
  SupervisorAnnouncement, 
  MeetingTask, 
  AdminFormRecord 
} from '../types';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock, 
  FileCheck2, 
  Send, 
  ArrowUpRight, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

interface DashboardProps {
  suppliers: Supplier[];
  announcements: SupervisorAnnouncement[];
  tasks: MeetingTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<MeetingTask, 'id' | 'completed'>) => void;
  onNavigateToForms: (supplierId?: string, formType?: string) => void;
  onNavigateToSuppliers: () => void;
  onNavigateToRisk: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  suppliers,
  announcements,
  tasks,
  onToggleTask,
  onAddTask,
  onNavigateToForms,
  onNavigateToSuppliers,
  onNavigateToRisk,
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<SupervisorAnnouncement | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('林志明 (中區專員)');
  const [newTaskCategory, setNewTaskCategory] = useState<'產發會議' | '採購例會' | '食安稽核'>('產發會議');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-04-25');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger transient feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute metrics
  const totalSuppliers = suppliers.length;
  const gradeACount = suppliers.filter((s) => s.grade === 'A').length;
  const gradeBCount = suppliers.filter((s) => s.grade === 'B').length;
  const gradeCCount = suppliers.filter((s) => s.grade === 'C').length;
  const avgContractRate = Math.round(
    suppliers.reduce((acc, curr) => acc + curr.contractRate, 0) / (totalSuppliers || 1)
  );
  const highRiskCount = suppliers.filter((s) => s.riskLevel === 'high').length;

  // Compute certificate expiration cards
  const certificateAlerts: Array<{
    supplier: Supplier;
    cert: Supplier['certificates'][0];
  }> = [];

  suppliers.forEach((sup) => {
    sup.certificates.forEach((cert) => {
      if (cert.daysRemaining <= 60) {
        certificateAlerts.push({ supplier: sup, cert });
      }
    });
  });

  // Sort: expired first, then smallest daysRemaining
  certificateAlerts.sort((a, b) => a.cert.daysRemaining - b.cert.daysRemaining);

  // Tasks statistics
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const taskProgressPercent = Math.round((completedTasksCount / (tasks.length || 1)) * 100);

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle.trim(),
      meetingDate: '2026-04 產發追蹤事項',
      category: newTaskCategory,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate,
      notes: '由主管指派建立之即時行動追蹤事項。',
    });
    setNewTaskTitle('');
    setIsAddTaskModalOpen(false);
    showToast('已成功新增產發追蹤事項！');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm border border-slate-700 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome & KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div 
          onClick={onNavigateToSuppliers}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">合作供應商總數</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalSuppliers}
            </span>
            <span className="text-xs text-slate-500">家契作農戶</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-700 font-medium">A級 {gradeACount}</span>
            <span>·</span>
            <span className="text-blue-700 font-medium">B級 {gradeBCount}</span>
            <span>·</span>
            <span className="text-rose-700 font-medium">C級 {gradeCCount}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={onNavigateToSuppliers}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">平均總契約達成率</span>
            <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
              {avgContractRate}%
            </span>
            <span className="text-xs text-slate-500">A級標準 ≧65%</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            達標率評級：<span className="text-emerald-700 font-medium">良好 (超越整體均標)</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={onNavigateToRisk}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">有機高風險專案列管</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-600">
              {highRiskCount}
            </span>
            <span className="text-xs text-slate-500">家需加強查核</span>
          </div>
          <div className="mt-3 text-xs text-rose-700 font-medium">
            美濃吳淑惠、苗栗大湖草莓專案
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onNavigateToForms()}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">證書即期與未審表單</span>
            <FileCheck2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {certificateAlerts.length}
            </span>
            <span className="text-xs text-slate-500">張證書需展延</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            含 <span className="text-rose-600 font-medium font-mono tabular-nums">1</span> 張已逾期證書需停權
          </div>
        </div>
      </div>

      {/* Row 2: Certificate Alerts Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 rounded-md text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                證書到期提醒警示卡片 (近期 60 天內需展延換證)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                系統每日自動比對農糧署有機、產銷履歷及 SGS 檢驗報告效期，預防農友因換證空窗期影響供貨。
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">
            共 {certificateAlerts.length} 筆警示項目
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {certificateAlerts.map(({ supplier, cert }) => {
            const isExpired = cert.daysRemaining <= 0;
            const isUrgent = cert.daysRemaining > 0 && cert.daysRemaining <= 30;

            return (
              <div
                key={cert.id}
                className={`p-4 rounded-lg border transition-all ${
                  isExpired
                    ? 'bg-rose-50/40 border-rose-200'
                    : isUrgent
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-900">{supplier.name}</span>
                  <span
                    className={`font-mono font-medium px-2 py-0.5 rounded text-xs ${
                      isExpired
                        ? 'bg-rose-600 text-white'
                        : isUrgent
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isExpired
                      ? `已逾期 ${Math.abs(cert.daysRemaining)} 天`
                      : `剩餘 ${cert.daysRemaining} 天`}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium mb-1 line-clamp-1" title={cert.name}>
                  {cert.name}
                </div>
                <div className="text-xs text-slate-500 mb-1">
                  發證機構：{cert.issuer}
                </div>
                <div className="text-xs text-slate-400 font-mono mb-3">
                  到期日：{cert.expireDate}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => showToast(`已發送 LINE 提醒與簡訊至 ${supplier.name} (${supplier.phone})`)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                  >
                    <Send className="w-3 h-3 text-slate-500" />
                    <span>催告提醒</span>
                  </button>
                  <button
                    onClick={() => onNavigateToForms(supplier.id, 'price_item_change')}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors"
                  >
                    <FileCheck2 className="w-3 h-3" />
                    <span>展延申請</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Split 2 Columns - Supervisor Bulletin & Meeting Action Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 主管公佈欄 (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-800">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">主管公佈欄與政策佈達</h2>
              </div>
              <span className="text-xs text-slate-400">即時同步</span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-medium px-1.5 py-0.5 rounded text-xs ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : ann.priority === 'important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ann.priority === 'urgent' ? '緊急督導' : ann.priority === 'important' ? '重點政策' : '常規通報'}
                    </span>
                    <span className="text-slate-400 font-mono">{ann.date}</span>
                  </div>

                  <h3 className="text-sm font-medium text-slate-900 line-clamp-1 mb-1">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {ann.content}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                    <span>發佈人：{ann.author} ({ann.role})</span>
                    <div className="flex items-center gap-1 text-emerald-700 hover:underline">
                      <span>詳情</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>採購發產會議每週三上午 09:30 定期召開</span>
            <button 
              onClick={() => showToast('公佈欄內容已更新至最新版本！')}
              className="text-emerald-700 font-medium hover:underline"
            >
              刷新資訊
            </button>
          </div>
        </div>

        {/* Right Column: 產發會議追蹤事項 (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-800">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    產發會議追蹤事項 (專員勾選核銷)
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    已完成 <span className="font-mono font-semibold text-emerald-700">{completedTasksCount}</span> / {tasks.length} 項 ({taskProgressPercent}%)
                  </div>
                </div>
              </div>

              {/* Task Filter & Add Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setTaskFilter('all')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      taskFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setTaskFilter('pending')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      taskFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    待處理
                  </button>
                  <button
                    onClick={() => setTaskFilter('completed')}
                    className={`px-2 py-1 rounded-md font-medium transition-colors ${
                      taskFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    已完成
                  </button>
                </div>

                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>指派事項</span>
                </button>
              </div>
            </div>

            {/* Task Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  目前無符合條件的追蹤事項
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={task.completed ? '標記為未完成' : '專員完成勾選核銷'}
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 hover:text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-sm font-medium ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs font-mono shrink-0 text-slate-500">
                          截止：{task.dueDate}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-700">專員：{task.assignee}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 text-xs">
                          {task.category}
                        </span>
                        {task.completed && (
                          <span className="text-emerald-700 font-medium ml-auto text-xs">
                            ✓ 已核銷 ({task.completedAt || '本日'})
                          </span>
                        )}
                      </div>

                      {task.notes && (
                        <div className="mt-1 text-xs text-slate-400 italic">
                          備註：{task.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>由產銷專員於現場實地確認或電話輔導後即時勾選回報</span>
            <span className="font-mono text-emerald-700">完成率 {taskProgressPercent}%</span>
          </div>
        </div>

      </div>

      {/* Modal: Announcement Detail */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                {selectedAnnouncement.priority === 'urgent' ? '緊急督導' : '政策公告'}
              </span>
              <span className="font-mono">{selectedAnnouncement.date}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {selectedAnnouncement.title}
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed space-y-2 mb-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <p>{selectedAnnouncement.content}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
              <span>發佈單位：{selectedAnnouncement.role} - {selectedAnnouncement.author}</span>
              <div className="flex gap-1">
                {selectedAnnouncement.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 bg-slate-200/60 rounded text-slate-600 text-xs">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              指派新增產發會議追蹤事項
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  事項名稱與行動內容
                </label>
                <input
                  type="text"
                  required
                  placeholder="例：針對綠生農場鄰田空飄農藥進行現場緩衝帶複查"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    會議類別
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="產發會議">產發會議</option>
                    <option value="採購例會">採購例會</option>
                    <option value="食安稽核">食安稽核</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    指定負責專員
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="林志明 (中區專員)">林志明 (中區專員)</option>
                    <option value="王維平 (中區專員)">王維平 (中區專員)</option>
                    <option value="高子翔 (南區專員)">高子翔 (南區專員)</option>
                    <option value="周建華 (東區專員)">周建華 (東區專員)</option>
                    <option value="張美琪 (食安稽核)">張美琪 (食安稽核)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  預計完成期限
                </label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                >
                  確認指派
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
