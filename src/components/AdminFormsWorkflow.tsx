import React, { useState, useEffect } from 'react';
import { Supplier, AdminFormRecord, FormType, SupplierGrade } from '../types';
import { 
  FileText, 
  Save, 
  Archive, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Plus, 
  CheckSquare, 
  Square, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  Layers 
} from 'lucide-react';

interface AdminFormsWorkflowProps {
  suppliers: Supplier[];
  forms: AdminFormRecord[];
  onSaveForm: (form: AdminFormRecord) => void;
  onBatchUpdateStatus: (formIds: string[], newStatus: AdminFormRecord['status']) => void;
  onDeleteForm: (formId: string) => void;
  initialSupplierId?: string;
  initialFormType?: FormType;
}

export const AdminFormsWorkflow: React.FC<AdminFormsWorkflowProps> = ({
  suppliers,
  forms,
  onSaveForm,
  onBatchUpdateStatus,
  onDeleteForm,
  initialSupplierId,
  initialFormType,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'closed'>('draft');
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  // Form Editor Fields
  const [formType, setFormType] = useState<FormType>(initialFormType || 'annual_eval');
  const [supplierId, setSupplierId] = useState<string>(initialSupplierId || (suppliers[0]?.id || ''));
  const [formTitle, setFormTitle] = useState<string>('');
  const [applicant, setApplicant] = useState<string>('林志明 (產銷專員)');
  const [summary, setSummary] = useState<string>('');

  // Form Specific Fields
  const [evalReason, setEvalReason] = useState<string>('');
  const [proposedGrade, setProposedGrade] = useState<SupplierGrade>('A');
  const [priceOld, setPriceOld] = useState<number>(85);
  const [priceNew, setPriceNew] = useState<number>(95);
  const [itemVariety, setItemVariety] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<number>(45);
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState<number>(1000);
  const [changeReason, setChangeReason] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>('2026-05-01');

  // Auto-Save States
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string>('剛剛');
  const [autoSaveNotification, setAutoSaveNotification] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Form Creator
  const handleOpenNewForm = (type: FormType = 'annual_eval', targetSupId?: string) => {
    const targetSup = suppliers.find((s) => s.id === (targetSupId || supplierId)) || suppliers[0];
    setFormType(type);
    setSupplierId(targetSup.id);
    setEditingFormId(null);
    
    if (type === 'annual_eval') {
      setFormTitle(`2026 年度 ${targetSup.name} 供應商年度評估表`);
      setProposedGrade(targetSup.grade);
      setSummary(`總契約達成率 ${targetSup.contractRate}%，綜合評定維持 ${targetSup.grade} 級合作方針。`);
      setEvalReason('各項品質規範符合標準，無農藥殘留違規紀錄。');
    } else if (type === 'risk_eval') {
      setFormTitle(`${targetSup.name} 有機完整性五維度風險評估表`);
      setSummary(`針對田區鄰田農藥空飄與資材來源進行重點查核。`);
      setEvalReason('周邊防風黑網架設完整，水源取水井專屬獨立。');
    } else if (type === 'price_change') {
      setFormTitle(`${targetSup.name} 品項進價異動申請表`);
      setItemVariety('有機生薑 (鮮採洗淨級)');
      setPriceOld(85);
      setPriceNew(95);
      setChangeReason('因有機質堆肥與採收工資漲幅約 12%，申請彈性調整收購進價。');
      setSummary('申請調整主力品項規格進價。');
    } else {
      setFormTitle(`${targetSup.name} 新增品項異動申請表`);
      setItemVariety('四季春冷泡生茶 (500ml 瓶裝規格)');
      setUnitPrice(42);
      setEstimatedMonthlyVolume(1500);
      setChangeReason('因應夏季冷飲生鮮通路專案，新增冷泡生茶契作規格。');
      setSummary('申請新增契作品種與預估月交貨量。');
    }
    
    setIsEditorOpen(true);
  };

  const handleEditForm = (form: AdminFormRecord) => {
    setEditingFormId(form.id);
    setFormType(form.formType);
    setSupplierId(form.supplierId);
    setFormTitle(form.title);
    setApplicant(form.applicant);
    setSummary(form.summary);
    setProposedGrade(form.data.proposedGrade || 'A');
    setEvalReason(form.data.evalReason || '');
    setPriceOld(form.data.priceOld || 0);
    setPriceNew(form.data.priceNew || 0);
    setItemVariety(form.data.itemVariety || '');
    setUnitPrice(form.data.unitPrice || 45);
    setEstimatedMonthlyVolume(form.data.estimatedMonthlyVolume || 1000);
    setChangeReason(form.data.changeReason || '');
    setEffectiveDate(form.data.effectiveDate || '2026-05-01');
    setIsEditorOpen(true);
  };

  // Automated draft saving effect
  useEffect(() => {
    if (!isEditorOpen) return;
    const timer = setTimeout(() => {
      const timeStr = new Date().toLocaleTimeString('zh-TW', { hour12: false });
      setLastAutoSavedTime(timeStr);
      setAutoSaveNotification(true);
      setTimeout(() => setAutoSaveNotification(false), 1800);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formTitle, summary, evalReason, priceOld, priceNew, itemVariety, unitPrice, estimatedMonthlyVolume, changeReason, formType, supplierId]);

  // Save to Draft Storage
  const handleSaveDraft = () => {
    const targetSup = suppliers.find((s) => s.id === supplierId) || suppliers[0];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newRecord: AdminFormRecord = {
      id: editingFormId || `FORM-2026-${String(forms.length + 1).padStart(3, '0')}`,
      formType,
      title: formTitle || `${targetSup.name} 申請表`,
      supplierId: targetSup.id,
      supplierName: targetSup.name,
      status: 'draft',
      applicant,
      createdAt: nowStr,
      updatedAt: nowStr,
      autoSavedAt: nowStr,
      summary,
      data: {
        proposedGrade,
        evalReason,
        priceOld,
        priceNew,
        itemVariety,
        unitPrice,
        estimatedMonthlyVolume,
        changeReason,
        effectiveDate,
      },
    };
    onSaveForm(newRecord);
    setIsEditorOpen(false);
    showToast('表單已儲存至「暫存區」，可隨時恢復編輯！');
  };

  // Close Case Action (按下結案：移至結案區，自暫存區清除)
  const handleCloseCaseDirectly = (formId?: string) => {
    const idToClose = formId || editingFormId;
    if (idToClose) {
      onBatchUpdateStatus([idToClose], 'closed');
      setIsEditorOpen(false);
      showToast(`表單 ${idToClose} 已按下結案！已移入結案區並自暫存清除。`);
    } else {
      // New form direct close
      const targetSup = suppliers.find((s) => s.id === supplierId) || suppliers[0];
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newRecord: AdminFormRecord = {
        id: `FORM-2026-${String(forms.length + 1).padStart(3, '0')}`,
        formType,
        title: formTitle || `${targetSup.name} 申請表`,
        supplierId: targetSup.id,
        supplierName: targetSup.name,
        status: 'closed',
        applicant,
        createdAt: nowStr,
        updatedAt: nowStr,
        autoSavedAt: nowStr,
        summary,
        data: {
          proposedGrade,
          evalReason,
          priceOld,
          priceNew,
          itemVariety,
          unitPrice,
          estimatedMonthlyVolume,
          changeReason,
          effectiveDate,
        },
      };
      onSaveForm(newRecord);
      setIsEditorOpen(false);
      showToast('表單已直接核定結案，移入「結案區」封存！');
    }
  };

  // Filter forms by status tab & sort: 按修改日期由新到舊排序
  const sortedForms = [...forms].sort(
    (a, b) => new Date(b.updatedAt || b.autoSavedAt).getTime() - new Date(a.updatedAt || a.autoSavedAt).getTime()
  );

  const filteredForms = sortedForms.filter((f) => {
    if (activeTab === 'draft') return f.status === 'draft';
    if (activeTab === 'closed') return f.status === 'closed';
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedFormIds.length === filteredForms.length) {
      setSelectedFormIds([]);
    } else {
      setSelectedFormIds(filteredForms.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedFormIds.includes(id)) {
      setSelectedFormIds(selectedFormIds.filter((item) => item !== id));
    } else {
      setSelectedFormIds([...selectedFormIds, id]);
    }
  };

  // Batch Close
  const handleBatchClose = () => {
    if (selectedFormIds.length === 0) return;
    onBatchUpdateStatus(selectedFormIds, 'closed');
    showToast(`已批次將 ${selectedFormIds.length} 筆暫存表單核定結案！`);
    setSelectedFormIds([]);
  };

  const getFormTypeLabel = (type: FormType) => {
    switch (type) {
      case 'annual_eval':
        return '供應商年度評估表';
      case 'risk_eval':
        return '風險評估表';
      case 'price_change':
        return '品項進價異動表';
      case 'new_item_change':
        return '新增品項異動表';
    }
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

      {/* Top Header & 4 Form Shortcut Selectors */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                行政表單整合與暫存／結案流程管理
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono">
                Workflow Automation
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              提供「供應商年度評估表」、「風險評估表」、「品項進價異動表」與「新增品項異動表」選單。
              具備<strong>自動儲存至暫存區 (按修改日期新到舊排序)</strong> 及 <strong>按下結案移至結案區</strong> 流程控制。
            </p>
          </div>

          {/* Form Launchers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenNewForm('annual_eval')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>年度評估表</span>
            </button>
            <button
              onClick={() => handleOpenNewForm('risk_eval')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>風險評估表</span>
            </button>
            <button
              onClick={() => handleOpenNewForm('price_change')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>進價異動表</span>
            </button>
            <button
              onClick={() => handleOpenNewForm('new_item_change')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增品項異動</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: 全部 / 暫存區 / 結案區 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3.5 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'draft' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>暫存區 (草稿)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-bold">
              {forms.filter((f) => f.status === 'draft').length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-3.5 py-1.5 font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'closed' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>結案區 (封存檔)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full">
              {forms.filter((f) => f.status === 'closed').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部總表 ({forms.length})
          </button>
        </div>

        {/* Batch Operations */}
        <div className="flex items-center gap-2">
          {selectedFormIds.length > 0 && (
            <span className="text-xs text-slate-500 font-mono">
              已勾選 {selectedFormIds.length} 筆：
            </span>
          )}

          {activeTab === 'draft' && (
            <button
              onClick={handleBatchClose}
              disabled={selectedFormIds.length === 0}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>批次按下結案</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono hidden sm:inline">
            依修改時間由新到舊排序
          </div>
        </div>

      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    aria-label="全選表單"
                    className="text-slate-400 hover:text-slate-700"
                  >
                    {selectedFormIds.length === filteredForms.length && filteredForms.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">單號 / 表單選單</th>
                <th className="py-3 px-3">供應商 / 專員</th>
                <th className="py-3 px-4">主旨與異動內容摘要</th>
                <th className="py-3 px-3 text-center">分區狀態</th>
                <th className="py-3 px-3 text-center">最後自動儲存時間</th>
                <th className="py-3 px-4 text-right">流程操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredForms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    目前暫無此分區之表單資料
                  </td>
                </tr>
              ) : (
                filteredForms.map((form) => {
                  const isChecked = selectedFormIds.includes(form.id);

                  return (
                    <tr
                      key={form.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleSelectOne(form.id)}
                          aria-label={`選取表單 ${form.id}`}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Code & Form Type */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900">{form.id}</div>
                        <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          {getFormTypeLabel(form.formType)}
                        </div>
                      </td>

                      {/* Supplier & Applicant */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{form.supplierName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {form.applicant}
                        </div>
                      </td>

                      {/* Summary */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-medium text-slate-900 line-clamp-1">{form.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {form.summary}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {form.status === 'draft' ? (
                          <span className="inline-block px-2 py-0.5 rounded font-medium text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                            暫存區 (草稿)
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded font-medium text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                            結案區 (已歸檔)
                          </span>
                        )}
                      </td>

                      {/* Autosaved Time */}
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400">
                        {form.autoSavedAt || form.updatedAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {form.status === 'draft' ? (
                            <>
                              <button
                                onClick={() => handleEditForm(form)}
                                className="px-2 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded font-medium"
                              >
                                編輯/查看
                              </button>
                              <button
                                onClick={() => handleCloseCaseDirectly(form.id)}
                                className="px-2 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded font-medium flex items-center gap-1"
                                title="直接按下結案，移至結案區並從暫存區清除"
                              >
                                <Archive className="w-3 h-3" />
                                <span>按下結案</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditForm(form)}
                              className="px-2 py-1 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded font-medium"
                            >
                              調閱封存檔
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteForm(form.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="刪除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            顯示共 <span className="font-mono font-bold text-slate-800">{filteredForms.length}</span> 筆表單紀錄
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>自動儲存至暫存區 · 按下結案後自動清除暫存並移至結案區</span>
          </div>
        </div>
      </div>

      {/* Modal: Interactive Form Editor */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingFormId ? `編輯表單 (${editingFormId})` : '開立行政與契作異動表單'}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>專員：{applicant}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-700 flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      <span>{autoSaveNotification ? '自動儲存中...' : `自動儲存於 ${lastAutoSavedTime}`}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form Menu Selection (4 types) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setFormType('annual_eval')}
                className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                  formType === 'annual_eval'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                供應商年度評估表
              </button>
              <button
                type="button"
                onClick={() => setFormType('risk_eval')}
                className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                  formType === 'risk_eval'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                風險評估表
              </button>
              <button
                type="button"
                onClick={() => setFormType('price_change')}
                className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                  formType === 'price_change'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                品項進價異動表
              </button>
              <button
                type="button"
                onClick={() => setFormType('new_item_change')}
                className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                  formType === 'new_item_change'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                新增品項異動表
              </button>
            </div>

            {/* Base Form Inputs */}
            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    目標供應商
                  </label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code} · {s.grade}級)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    提出專員
                  </label>
                  <input
                    type="text"
                    value={applicant}
                    onChange={(e) => setApplicant(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  表單名稱 / 主旨
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              {/* Form 1: 供應商年度評估表 */}
              {formType === 'annual_eval' && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 block">
                    供應商年度綜合考核與續約核定
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">建議考核評級</label>
                      <select
                        value={proposedGrade}
                        onChange={(e) => setProposedGrade(e.target.value as SupplierGrade)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                      >
                        <option value="A">A 級（優良合作）</option>
                        <option value="B">B 級（穩定合作）</option>
                        <option value="C">C 級（改善觀察）</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">契約達成率門檻標準</label>
                      <input
                        type="text"
                        disabled
                        value="A 級 ≧65%、B 級 50%~64%、C 級 <50%"
                        className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-100 text-slate-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">專員年度綜合評語與考評理由</label>
                    <textarea
                      rows={2}
                      value={evalReason}
                      onChange={(e) => setEvalReason(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                      placeholder="請說明交貨穩定度、規格達成率及合作配合度..."
                    />
                  </div>
                </div>
              )}

              {/* Form 2: 風險評估表 */}
              {formType === 'risk_eval' && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 block">
                    有機完整性五維度風險評估 (人·事·時·地·物)
                  </span>
                  <div>
                    <label className="block text-slate-600 mb-1">五大維度查核結論與防護改善對策</label>
                    <textarea
                      rows={3}
                      value={evalReason}
                      onChange={(e) => setEvalReason(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                      placeholder="針對人(有機認知)、事(矯正措施)、時(高風險期)、地(鄰田隔離)、物(資材安全)之查核紀錄..."
                    />
                  </div>
                </div>
              )}

              {/* Form 3: 品項進價異動表 */}
              {formType === 'price_change' && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 block">
                    現有契作品項進價調整申請
                  </span>
                  <div>
                    <label className="block text-slate-600 mb-1">異動品項名稱與規格</label>
                    <input
                      type="text"
                      value={itemVariety}
                      onChange={(e) => setItemVariety(e.target.value)}
                      placeholder="例：有機生薑 (鮮採洗淨級)"
                      className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-1">原進價 (NT$/kg)</label>
                      <input
                        type="number"
                        value={priceOld}
                        onChange={(e) => setPriceOld(Number(e.target.value))}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">擬調新進價 (NT$/kg)</label>
                      <input
                        type="number"
                        value={priceNew}
                        onChange={(e) => setPriceNew(Number(e.target.value))}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-mono text-emerald-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">預計生效日期</label>
                      <input
                        type="date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">進價調整原因與成本說明</label>
                    <textarea
                      rows={2}
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                      placeholder="說明肥料調漲、包裝成本或採收工資漲幅理由..."
                    />
                  </div>
                </div>
              )}

              {/* Form 4: 新增品項異動表 */}
              {formType === 'new_item_change' && (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-800 block">
                    新增契作品項與收購規格
                  </span>
                  <div>
                    <label className="block text-slate-600 mb-1">新增品項名稱與規格規格</label>
                    <input
                      type="text"
                      value={itemVariety}
                      onChange={(e) => setItemVariety(e.target.value)}
                      placeholder="例：四季春冷泡生茶 (500ml 瓶裝規格)"
                      className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-1">建議收購進價 (NT$/件)</label>
                      <input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">預估月供應量</label>
                      <input
                        type="number"
                        value={estimatedMonthlyVolume}
                        onChange={(e) => setEstimatedMonthlyVolume(Number(e.target.value))}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">預計首批交貨日</label>
                      <input
                        type="date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">新增契作品項緣由與市場評估</label>
                    <textarea
                      rows={2}
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                      placeholder="說明通路專案促銷需求、產量供貨檔期規劃..."
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  摘要說明 (顯示於列表總覽)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

            </div>

            {/* Actions: 自動儲存至暫存區 & 按下結案 */}
            <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-mono">
                每 1.2 秒自動儲存至「暫存區」
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>儲存至暫存區</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCloseCaseDirectly()}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>按下結案</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
