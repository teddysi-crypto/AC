import React, { useState } from 'react';
import { Supplier, SupplierGrade } from '../types';
import { 
  calculateGradeFromContractRate, 
  calculateWeightedTotalScore, 
  GRADE_CONFIG, 
  RISK_CONFIG 
} from '../utils/calc';
import { 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Calculator, 
  CheckCircle, 
  ChevronRight, 
  Building2, 
  ArrowUpDown, 
  MapPin, 
  Phone, 
  FileSpreadsheet, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';

interface SupplierGradingProps {
  suppliers: Supplier[];
  onUpdateSupplier: (updated: Supplier) => void;
  onNavigateToForms: (supplierId: string, formType: string) => void;
  onNavigateToRisk: (supplierId?: string) => void;
}

export const SupplierGrading: React.FC<SupplierGradingProps> = ({
  suppliers,
  onUpdateSupplier,
  onNavigateToForms,
  onNavigateToRisk,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedSupplierForModal, setSelectedSupplierForModal] = useState<Supplier | null>(null);

  // Score simulator states
  const [simContractRate, setSimContractRate] = useState<number>(75);
  const [simMainRate, setSimMainRate] = useState<number>(80);
  const [simQualityScore, setSimQualityScore] = useState<number>(85);
  const [simCooperationScore, setSimCooperationScore] = useState<number>(85);
  const [simPotentialScore, setSimPotentialScore] = useState<number>(80);

  const openSimulator = (sup: Supplier) => {
    setSelectedSupplierForModal(sup);
    setSimContractRate(sup.contractRate);
    setSimMainRate(sup.mainCategoryRate);
    setSimQualityScore(sup.qualityScore);
    setSimCooperationScore(sup.cooperationScore);
    setSimPotentialScore(sup.potentialScore);
  };

  const computedSimGrade = calculateGradeFromContractRate(simContractRate);
  const computedSimTotal = calculateWeightedTotalScore(
    simCooperationScore,
    simPotentialScore,
    simQualityScore,
    simContractRate,
    simMainRate
  );

  const handleSaveSimulation = () => {
    if (!selectedSupplierForModal) return;
    const updated: Supplier = {
      ...selectedSupplierForModal,
      contractRate: simContractRate,
      mainCategoryRate: simMainRate,
      qualityScore: simQualityScore,
      cooperationScore: simCooperationScore,
      potentialScore: simPotentialScore,
      weightedTotalScore: computedSimTotal,
      grade: computedSimGrade,
    };
    onUpdateSupplier(updated);
    setSelectedSupplierForModal(null);
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.includes(searchTerm) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.crops.some((c) => c.includes(searchTerm));
    const matchesRegion = regionFilter === 'all' || s.region === regionFilter;
    const matchesGrade = gradeFilter === 'all' || s.grade === gradeFilter;
    const matchesRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchesSearch && matchesRegion && matchesGrade && matchesRisk;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Logic Explanations & Grading Rules */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                供應商年度考核評分矩陣與 A/B/C 分級規範
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                SOP-SCM-041
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              評分矩陣嚴格整合<strong className="text-slate-800">專員自評 (35%)</strong>、
              <strong className="text-slate-800">採購自評 (25%)</strong> 與 
              <strong className="text-slate-800">系統客觀數據 (40%)</strong>。
              等級換算核心門檻：總契約達成率 <span className="text-emerald-700 font-semibold font-mono">≧ 65% 為 A 級</span>、
              <span className="text-blue-700 font-semibold font-mono">50%~64% 為 B 級</span>、
              <span className="text-rose-700 font-semibold font-mono">&lt; 50% 列為 C 級列管</span>。
            </p>
          </div>

          {/* Quick Grade Summary Chips */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-800">A 級 (≧65%)</span>
              <div className="text-[11px] text-emerald-700 mt-0.5">優先續約 / 量產主打</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs">
              <span className="font-bold text-blue-800">B 級 (50~64%)</span>
              <div className="text-[11px] text-blue-700 mt-0.5">常態合約 / 加強輔導</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs">
              <span className="font-bold text-rose-800">C 級 (&lt;50%)</span>
              <div className="text-[11px] text-rose-700 mt-0.5">專案輔導 / 限期改善</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋供應商代碼、名稱 (如: 慈耕楊文正、吳淑惠)、主力作物..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          <select
            aria-label="選擇產銷區域"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="all">產銷區域 (全部)</option>
            <option value="北部">北部區域</option>
            <option value="中部">中部區域</option>
            <option value="南部">南部區域</option>
            <option value="東部">東部區域</option>
          </select>

          {/* Grade Filter */}
          <select
            aria-label="選擇考核等級"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="all">考核等級 (全部)</option>
            <option value="A">A 級 (≧65%)</option>
            <option value="B">B 級 (50%~64%)</option>
            <option value="C">C 級 (&lt;50%)</option>
          </select>

          {/* Risk Level Filter */}
          <select
            aria-label="選擇有機風險等級"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="all">有機風險 (全部)</option>
            <option value="low">低風險 (例行追蹤)</option>
            <option value="medium">中風險 (加強查核)</option>
            <option value="high">高風險 (專案查核)</option>
          </select>

          {(searchTerm || regionFilter !== 'all' || gradeFilter !== 'all' || riskFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRegionFilter('all');
                setGradeFilter('all');
                setRiskFilter('all');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-1 py-1"
            >
              重設篩選
            </button>
          )}
        </div>
      </div>

      {/* Supplier Matrix Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">基本資料 (編號 / 名稱)</th>
                <th className="py-3 px-3">區域 / 主力品項</th>
                <th className="py-3 px-3 text-center bg-slate-100/50">
                  <div className="text-slate-700 font-bold">總契約達成率</div>
                  <div className="text-[10px] text-slate-400 font-normal">A≧65% · B 50~64% · C&lt;50%</div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div>主力品項達成率</div>
                  <div className="text-[10px] text-slate-400 font-normal">系統數據 15%</div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div>採購自評：交貨品質</div>
                  <div className="text-[10px] text-slate-400 font-normal">權重 25%</div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div>專員自評：配合度 / 潛力</div>
                  <div className="text-[10px] text-slate-400 font-normal">配合 20% · 潛力 15%</div>
                </th>
                <th className="py-3 px-3 text-center">最終等級</th>
                <th className="py-3 px-3 text-center">有機完整性</th>
                <th className="py-3 px-4 text-right">操作與試算</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSuppliers.map((supplier) => {
                const gradeInfo = GRADE_CONFIG[supplier.grade];
                const riskInfo = RISK_CONFIG[supplier.riskLevel];

                return (
                  <tr
                    key={supplier.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Col 1: Supplier Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                          {supplier.grade}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{supplier.name}</span>
                            {supplier.certifiedOrganic && (
                              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                有機驗證
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                            {supplier.code} · 代表人：{supplier.representative}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Crops & Region */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-800 font-medium line-clamp-1">
                        {supplier.crops.join('、')}
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{supplier.region} · {supplier.totalAreaHectares} 公頃</span>
                      </div>
                    </td>

                    {/* Col 3: Contract Rate (Objective Key Metric) */}
                    <td className="py-3.5 px-3 text-center bg-slate-50/50">
                      <div className="font-mono font-bold text-sm tabular-nums">
                        <span
                          className={
                            supplier.contractRate >= 65
                              ? 'text-emerald-700'
                              : supplier.contractRate >= 50
                              ? 'text-blue-700'
                              : 'text-rose-600'
                          }
                        >
                          {supplier.contractRate}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {supplier.contractRate >= 65
                          ? '≧65% 達標'
                          : supplier.contractRate >= 50
                          ? '50~64% 中度'
                          : '<50% 未達標'}
                      </div>
                    </td>

                    {/* Col 4: Main Category Rate */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-800">
                      {supplier.mainCategoryRate}%
                    </td>

                    {/* Col 5: Procurement Quality Score */}
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-800">
                      {supplier.qualityScore} 分
                    </td>

                    {/* Col 6: Specialist Cooperation & Potential */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="font-mono tabular-nums text-slate-800">
                        {supplier.cooperationScore} / {supplier.potentialScore}
                      </div>
                      <div className="text-[10px] text-slate-400">配合 / 潛力</div>
                    </td>

                    {/* Col 7: Final Grade */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs border ${gradeInfo.bg} ${gradeInfo.color} ${gradeInfo.border}`}
                      >
                        {gradeInfo.label}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        加權 {supplier.weightedTotalScore} 分
                      </div>
                    </td>

                    {/* Col 8: Organic Risk */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => onNavigateToRisk(supplier.id)}
                        className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded text-xs border hover:opacity-80 transition-opacity ${riskInfo.badgeColor}`}
                        title="點擊查看該供應商五維度有機風險雷達"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${riskInfo.dotColor}`} />
                        <span>{riskInfo.label}</span>
                      </button>
                    </td>

                    {/* Col 9: Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openSimulator(supplier)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          title="開啟即時指標試算器"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          <span>試算模擬</span>
                        </button>
                        <button
                          onClick={() => onNavigateToForms(supplier.id, 'annual_eval')}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
                          title="開立年度評估表單"
                        >
                          <span>年度表</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            顯示共 <span className="font-mono font-semibold text-slate-900">{filteredSuppliers.length}</span> 家供應商資料
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>加權計算公式：(配合度×0.2) + (潛力×0.15) + (品質×0.25) + (契約達成×0.25) + (主力達成×0.15)</span>
          </div>
        </div>
      </div>

      {/* Modal: Evaluation Score Simulator */}
      {selectedSupplierForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    供應商考核評分矩陣與評級即時試算器
                  </h3>
                  <div className="text-xs text-slate-500">
                    目標對象：{selectedSupplierForModal.name} ({selectedSupplierForModal.code})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplierForModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Dynamic Result Preview Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">即時推算評級結果</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-2xl font-black font-mono ${
                      computedSimGrade === 'A'
                        ? 'text-emerald-700'
                        : computedSimGrade === 'B'
                        ? 'text-blue-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {GRADE_CONFIG[computedSimGrade].label}
                  </span>
                  <span className="text-xs text-slate-600">
                    (加權總分：<span className="font-mono font-bold text-slate-900">{computedSimTotal}</span> 分)
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {GRADE_CONFIG[computedSimGrade].desc}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">總契約達成率門檻</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {simContractRate}%
                </div>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    simContractRate >= 65
                      ? 'text-emerald-700'
                      : simContractRate >= 50
                      ? 'text-blue-700'
                      : 'text-rose-700'
                  }`}
                >
                  {simContractRate >= 65 ? '符合 A 級標準 (≧65%)' : simContractRate >= 50 ? '符合 B 級標準 (50-64%)' : '未達標列為 C 級 (<50%)'}
                </span>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-4 text-xs">
              
              {/* Slider 1: 總契約達成率 (關鍵分級指標 25%) */}
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span>1. 總契約達成率 (%)</span>
                    <span className="text-emerald-700 text-[11px] font-normal">[核心門檻指標 · 權重 25%]</span>
                  </span>
                  <span className="font-mono font-bold text-sm text-emerald-800">{simContractRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={simContractRate}
                  onChange={(e) => setSimContractRate(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>0% (C級)</span>
                  <span className="text-rose-600 font-bold">50% (B級分界)</span>
                  <span className="text-emerald-600 font-bold">65% (A級分界)</span>
                  <span>100% (完美)</span>
                </div>
              </div>

              {/* Slider 2: 主力類別達成率 (15%) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">2. 主力類別達成率 (系統客觀數據 · 權重 15%)</span>
                  <span className="font-mono font-semibold text-slate-900">{simMainRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={simMainRate}
                  onChange={(e) => setSimMainRate(Number(e.target.value))}
                  className="w-full accent-slate-600"
                />
              </div>

              {/* Slider 3: 採購品質評分 (25%) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">3. 採購自評：品質與規格 (權重 25%)</span>
                  <span className="font-mono font-semibold text-slate-900">{simQualityScore} 分</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={simQualityScore}
                  onChange={(e) => setSimQualityScore(Number(e.target.value))}
                  className="w-full accent-slate-600"
                />
              </div>

              {/* Slider 4: 專員自評 - 配合度 (20%) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">4. 專員自評：日常配合度與出貨準時率 (權重 20%)</span>
                  <span className="font-mono font-semibold text-slate-900">{simCooperationScore} 分</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={simCooperationScore}
                  onChange={(e) => setSimCooperationScore(Number(e.target.value))}
                  className="w-full accent-slate-600"
                />
              </div>

              {/* Slider 5: 專員自評 - 發展潛力 (15%) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">5. 專員自評：未來契作擴展與發展潛力 (權重 15%)</span>
                  <span className="font-mono font-semibold text-slate-900">{simPotentialScore} 分</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={simPotentialScore}
                  onChange={(e) => setSimPotentialScore(Number(e.target.value))}
                  className="w-full accent-slate-600"
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSimContractRate(selectedSupplierForModal.contractRate);
                  setSimMainRate(selectedSupplierForModal.mainCategoryRate);
                  setSimQualityScore(selectedSupplierForModal.qualityScore);
                  setSimCooperationScore(selectedSupplierForModal.cooperationScore);
                  setSimPotentialScore(selectedSupplierForModal.potentialScore);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                重置為原紀錄值
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplierForModal(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveSimulation}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>儲存更新指標</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
