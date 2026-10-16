import React, { useState } from 'react';
import { 
  Supplier, 
  SupervisorAnnouncement, 
  MeetingTask, 
  AdminFormRecord, 
  FieldReportRecord, 
  FormType 
} from './types';
import { 
  INITIAL_SUPPLIERS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_MEETING_TASKS, 
  INITIAL_ADMIN_FORMS, 
  INITIAL_FIELD_REPORTS 
} from './data/mockData';
import { Header } from './components/Header';
import { PortalHome } from './components/PortalHome';
import { Dashboard } from './components/Dashboard';
import { SupplierGrading } from './components/SupplierGrading';
import { OrganicRiskModule } from './components/OrganicRiskModule';
import { AdminFormsWorkflow } from './components/AdminFormsWorkflow';
import { FieldInspection } from './components/FieldInspection';
import { MeetingMaterials } from './components/MeetingMaterials';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [userRole, setUserRole] = useState<string>('林志明 (產銷專員)');

  // Main application state
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [announcements] = useState<SupervisorAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [tasks, setTasks] = useState<MeetingTask[]>(INITIAL_MEETING_TASKS);
  const [forms, setForms] = useState<AdminFormRecord[]>(INITIAL_ADMIN_FORMS);
  const [fieldReports, setFieldReports] = useState<FieldReportRecord[]>(INITIAL_FIELD_REPORTS);

  // Cross-module navigation context
  const [selectedSupplierForRisk, setSelectedSupplierForRisk] = useState<string | undefined>(undefined);
  const [targetSupplierForForm, setTargetSupplierForForm] = useState<string | undefined>(undefined);
  const [targetFormType, setTargetFormType] = useState<FormType | undefined>(undefined);

  // Toggle meeting task completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted
              ? new Date().toISOString().replace('T', ' ').substring(0, 16)
              : undefined,
          };
        }
        return t;
      })
    );
  };

  // Add new meeting task
  const handleAddTask = (newTask: Omit<MeetingTask, 'id' | 'completed'>) => {
    const task: MeetingTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
  };

  // Update supplier metrics & grade
  const handleUpdateSupplier = (updated: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  // Save admin form (draft or submit)
  const handleSaveForm = (newForm: AdminFormRecord) => {
    setForms((prev) => {
      const idx = prev.findIndex((f) => f.id === newForm.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newForm;
        return copy;
      }
      return [newForm, ...prev];
    });
  };

  // Batch update form status
  const handleBatchUpdateStatus = (
    formIds: string[],
    newStatus: AdminFormRecord['status']
  ) => {
    setForms((prev) =>
      prev.map((f) =>
        formIds.includes(f.id)
          ? {
              ...f,
              status: newStatus,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : f
      )
    );
  };

  // Delete form
  const handleDeleteForm = (formId: string) => {
    setForms((prev) => prev.filter((f) => f.id !== formId));
  };

  // Add field report
  const handleAddFieldReport = (newReport: FieldReportRecord) => {
    setFieldReports((prev) => [newReport, ...prev]);
  };

  // Navigation helpers
  const handleNavigateToForms = (supplierId?: string, formType?: string) => {
    setTargetSupplierForForm(supplierId);
    setTargetFormType((formType as FormType) || 'annual_eval');
    setActiveTab('forms');
  };

  const handleNavigateToRisk = (supplierId?: string) => {
    setSelectedSupplierForRisk(supplierId);
    setActiveTab('risk');
  };

  const draftCount = forms.filter((f) => f.status === 'draft').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        draftCount={draftCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Back Button if inside a sub-module */}
        {activeTab !== 'portal' && (
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('portal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← 返回多功能主選單 (Home)</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              AgriChain 多功能模組視圖
            </span>
          </div>
        )}

        {/* 1. Portal Home matching sketch */}
        {activeTab === 'portal' && (
          <PortalHome
            suppliers={suppliers}
            announcements={announcements}
            tasks={tasks}
            forms={forms}
            fieldReports={fieldReports}
            onNavigate={(tab) => setActiveTab(tab)}
            onToggleTask={handleToggleTask}
          />
        )}

        {/* 公告事項 / Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            suppliers={suppliers}
            announcements={announcements}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onNavigateToForms={handleNavigateToForms}
            onNavigateToSuppliers={() => setActiveTab('grading')}
            onNavigateToRisk={() => setActiveTab('risk')}
          />
        )}

        {/* 供應商資料查詢 */}
        {activeTab === 'grading' && (
          <SupplierGrading
            suppliers={suppliers}
            onUpdateSupplier={handleUpdateSupplier}
            onNavigateToForms={handleNavigateToForms}
            onNavigateToRisk={handleNavigateToRisk}
          />
        )}

        {/* 重點品項回報 */}
        {activeTab === 'field' && (
          <FieldInspection
            suppliers={suppliers}
            fieldReports={fieldReports}
            onAddFieldReport={handleAddFieldReport}
          />
        )}

        {/* 行政表單 */}
        {activeTab === 'forms' && (
          <AdminFormsWorkflow
            suppliers={suppliers}
            forms={forms}
            onSaveForm={handleSaveForm}
            onBatchUpdateStatus={handleBatchUpdateStatus}
            onDeleteForm={handleDeleteForm}
            initialSupplierId={targetSupplierForForm}
            initialFormType={targetFormType}
          />
        )}

        {/* 資料查詢 (有機五維度風險) */}
        {activeTab === 'risk' && (
          <OrganicRiskModule
            suppliers={suppliers}
            onUpdateSupplier={handleUpdateSupplier}
            onNavigateToForms={handleNavigateToForms}
            selectedSupplierId={selectedSupplierForRisk}
          />
        )}

        {/* 會議資料 */}
        {activeTab === 'meeting' && (
          <MeetingMaterials
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">多功能webapp介面</span>
            <span>·</span>
            <span>AgriChain 綠源農產供應鏈數位管理系統</span>
          </div>
          <div className="font-mono text-slate-400">
            SOP-SCM-2026.04
          </div>
        </div>
      </footer>

    </div>
  );
}
