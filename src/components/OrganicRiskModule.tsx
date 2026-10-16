import React, { useState } from 'react';
import { Supplier, RiskLevel } from '../types';
import { calculateOrganicRisk, RISK_CONFIG } from '../utils/calc';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  FileCheck, 
  Clock, 
  MapPin, 
  Package, 
  AlertTriangle, 
  Sliders, 
  CheckCircle, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Activity 
} from 'lucide-react';

interface OrganicRiskModuleProps {
  suppliers: Supplier[];
  onUpdateSupplier: (updated: Supplier) => void;
  onNavigateToForms: (supplierId: string, formType: string) => void;
  selectedSupplierId?: string;
}

export const OrganicRiskModule: React.FC<OrganicRiskModuleProps> = ({
  suppliers,
  onUpdateSupplier,
  onNavigateToForms,
  selectedSupplierId,
}) => {
  const [activeSupplierId, setActiveSupplierId] = useState<string>(
    selectedSupplierId || (suppliers[0]?.id || '')
  );
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing5D, setIsEditing5D] = useState(false);

  const activeSupplier =
    suppliers.find((s) => s.id === activeSupplierId) || suppliers[0];

  // 5D editing state
  const [editHuman, setEditHuman] = useState<number>(activeSupplier?.organic5D.human || 80);
  const [editMatter, setEditMatter] = useState<number>(activeSupplier?.organic5D.matter || 80);
  const [editTime, setEditTime] = useState<number>(activeSupplier?.organic5D.time || 80);
  const [editPlace, setEditPlace] = useState<number>(activeSupplier?.organic5D.place || 80);
  const [editMaterial, setEditMaterial] = useState<number>(activeSupplier?.organic5D.material || 80);
  const [editNotes, setEditNotes] = useState<string>(activeSupplier?.organic5D.notes || '');

  const startEditing = (sup: Supplier) => {
    setActiveSupplierId(sup.id);
    setEditHuman(sup.organic5D.human);
    setEditMatter(sup.organic5D.matter);
    setEditTime(sup.organic5D.time);
    setEditPlace(sup.organic5D.place);
    setEditMaterial(sup.organic5D.material);
    setEditNotes(sup.organic5D.notes);
    setIsEditing5D(true);
  };

  const currentCalc = calculateOrganicRisk(
    editHuman,
    editMatter,
    editTime,
    editPlace,
    editMaterial
  );

  const handleSave5D = () => {
    if (!activeSupplier) return;
    const updated: Supplier = {
      ...activeSupplier,
      riskLevel: currentCalc.riskLevel,
      organic5D: {
        human: editHuman,
        matter: editMatter,
        time: editTime,
        place: editPlace,
        material: editMaterial,
        overallScore: currentCalc.overallScore,
        notes: editNotes,
        lastEvaluatedDate: new Date().toISOString().split('T')[0],
      },
    };
    onUpdateSupplier(updated);
    setIsEditing5D(false);
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.includes(searchTerm) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const dimensions = [
    {
      key: 'human',
      label: '人（有機概念）',
      icon: UserCheck,
      desc: '經營者與田間作業人員之有機法規意識、農藥零容忍認知、臨時工施作訓練紀錄。',
      score: activeSupplier?.organic5D.human || 0,
      color: 'bg-emerald-500',
    },
    {
      key: 'matter',
      label: '事（年度矯正預防）',
      icon: FileCheck,
      desc: '歷次農藥殘留抽驗紀錄、不合格品改善措施與落實度 (CAPA)、自主快篩比率。',
      score: activeSupplier?.organic5D.matter || 0,
      color: 'bg-blue-500',
    },
    {
      key: 'time',
      label: '時（田區高風險時間）',
      icon: Clock,
      desc: '鄰田常規作物施藥高峰期、梅雨與連續降雨期、轉型期/轉換期交替管理。',
      score: activeSupplier?.organic5D.time || 0,
      color: 'bg-amber-500',
    },
    {
      key: 'place',
      label: '地（各田區風險）',
      icon: MapPin,
      desc: '鄰田緩衝帶實體距離 (防風林/隔離黑網)、空飄農藥受害機率、專屬灌溉水路獨立性。',
      score: activeSupplier?.organic5D.place || 0,
      color: 'bg-indigo-500',
    },
    {
      key: 'material',
      label: '物（資材風險）',
      icon: Package,
      desc: '外購有機質肥料審查、非化學農藥資材清冊、農機與噴藥桶共用清潔標準。',
      score: activeSupplier?.organic5D.material || 0,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                有機完整性風險分級矩陣（建構中）
              </span>
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                5D Organic Integrity
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              包含五大評估維度：<strong>人（有機概念）</strong>、<strong>事（年度矯正預防）</strong>、
              <strong>時（田區高風險時間）</strong>、<strong>地（各田區風險）</strong>、<strong>物（資材風險）</strong>。
              管理策略：<span className="text-emerald-700 font-bold">低風險（例行追蹤）</span>、
              <span className="text-amber-700 font-bold">中風險（加強查核）</span>、
              <span className="text-rose-700 font-bold">高風險（專案查核與供應管制）</span>。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToForms(activeSupplier.id, 'risk_eval')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>開立五維度風險評估表</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List (4 cols) & Right 5D Detail (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Supplier Risk Cards List */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Quick Filter */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋供應商..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-between gap-1 text-xs">
              <button
                onClick={() => setRiskFilter('all')}
                className={`flex-1 py-1 text-center rounded font-medium transition-colors ${
                  riskFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                全部 ({suppliers.length})
              </button>
              <button
                onClick={() => setRiskFilter('low')}
                className={`flex-1 py-1 text-center rounded font-medium transition-colors ${
                  riskFilter === 'low' ? 'bg-emerald-700 text-white' : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                低風險 ({suppliers.filter((s) => s.riskLevel === 'low').length})
              </button>
              <button
                onClick={() => setRiskFilter('medium')}
                className={`flex-1 py-1 text-center rounded font-medium transition-colors ${
                  riskFilter === 'medium' ? 'bg-amber-600 text-white' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                中風險 ({suppliers.filter((s) => s.riskLevel === 'medium').length})
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`flex-1 py-1 text-center rounded font-medium transition-colors ${
                  riskFilter === 'high' ? 'bg-rose-600 text-white' : 'text-rose-800 bg-rose-50 hover:bg-rose-100'
                }`}
              >
                高風險 ({suppliers.filter((s) => s.riskLevel === 'high').length})
              </button>
            </div>
          </div>

          {/* Supplier Cards Scroll */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredSuppliers.map((supplier) => {
              const isSelected = supplier.id === activeSupplierId;
              const riskInfo = RISK_CONFIG[supplier.riskLevel];

              return (
                <div
                  key={supplier.id}
                  onClick={() => {
                    setActiveSupplierId(supplier.id);
                    setIsEditing5D(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {supplier.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded text-xs border ${riskInfo.badgeColor}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${riskInfo.dotColor}`} />
                      <span>{riskInfo.label} ({riskInfo.action})</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 line-clamp-1 mb-2">
                    主力作物：{supplier.crops.join('、')}
                  </div>

                  {/* 5D Mini Horizontal Progress Strip */}
                  <div className="grid grid-cols-5 gap-1.5 py-1 text-[11px] font-mono text-center">
                    <div className="bg-slate-100 rounded py-0.5">
                      <span className="text-[10px] text-slate-400 block">人</span>
                      <span className="font-semibold text-slate-700">{supplier.organic5D.human}</span>
                    </div>
                    <div className="bg-slate-100 rounded py-0.5">
                      <span className="text-[10px] text-slate-400 block">事</span>
                      <span className="font-semibold text-slate-700">{supplier.organic5D.matter}</span>
                    </div>
                    <div className="bg-slate-100 rounded py-0.5">
                      <span className="text-[10px] text-slate-400 block">時</span>
                      <span className="font-semibold text-slate-700">{supplier.organic5D.time}</span>
                    </div>
                    <div className="bg-slate-100 rounded py-0.5">
                      <span className="text-[10px] text-slate-400 block">地</span>
                      <span className="font-semibold text-slate-700">{supplier.organic5D.place}</span>
                    </div>
                    <div className="bg-slate-100 rounded py-0.5">
                      <span className="text-[10px] text-slate-400 block">物</span>
                      <span className="font-semibold text-slate-700">{supplier.organic5D.material}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>綜合得分：<strong className="text-slate-800 font-mono font-bold">{supplier.organic5D.overallScore}</strong> 分</span>
                    <span>考核日：{supplier.organic5D.lastEvaluatedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Detailed 5D Radar & Action Console */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          
          <div>
            {/* Header of Active Supplier */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeSupplier.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {activeSupplier.code}
                  </span>
                  <span className="text-xs text-slate-500">
                    {activeSupplier.region} · {activeSupplier.totalAreaHectares} 公頃
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  主力作物：{activeSupplier.crops.join('、')} · 地址：{activeSupplier.address}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    RISK_CONFIG[activeSupplier.riskLevel].badgeColor
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${RISK_CONFIG[activeSupplier.riskLevel].dotColor}`} />
                  <span>{RISK_CONFIG[activeSupplier.riskLevel].label}</span>
                  <span>·</span>
                  <span>{RISK_CONFIG[activeSupplier.riskLevel].action}</span>
                </span>
                
                <button
                  onClick={() => startEditing(activeSupplier)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>稽核調整</span>
                </button>
              </div>
            </div>

            {/* 5-Dimension Visual Breakdown Cards */}
            <div className="space-y-3.5 mb-6">
              {dimensions.map((dim) => {
                const Icon = dim.icon;
                const score = isEditing5D ? (
                  dim.key === 'human' ? editHuman :
                  dim.key === 'matter' ? editMatter :
                  dim.key === 'time' ? editTime :
                  dim.key === 'place' ? editPlace : editMaterial
                ) : dim.score;

                const scoreColor =
                  score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-rose-700';

                return (
                  <div
                    key={dim.key}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-white text-slate-700 shadow-xs border border-slate-200">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{dim.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-base font-bold font-mono tabular-nums ${scoreColor}`}>
                          {score}
                        </span>
                        <span className="text-xs text-slate-400">分</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-2">{dim.desc}</p>

                    {/* Score Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          score >= 80 ? 'bg-emerald-600' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Field Notes & Audit Findings */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                稽核員現場訪查綜合備註與處置建議：
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeSupplier.organic5D.notes || '暫無特殊備註。'}
              </p>
              <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>最近綜合審定日期：{activeSupplier.organic5D.lastEvaluatedDate}</span>
                <span className="font-mono text-emerald-700">綜合評分：{activeSupplier.organic5D.overallScore} 分</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              管理策略：
              {activeSupplier.riskLevel === 'low' && (
                <span className="text-emerald-700 font-medium ml-1">
                  維持每季 1 次例行訪查與抽驗即可。
                </span>
              )}
              {activeSupplier.riskLevel === 'medium' && (
                <span className="text-amber-700 font-medium ml-1">
                  啟動每兩週 1 次加強查核，並確認緩衝帶物理防護。
                </span>
              )}
              {activeSupplier.riskLevel === 'high' && (
                <span className="text-rose-700 font-medium ml-1">
                  列入專案查核與管制，暫緩擴增契作品項，啟動改善輔導。
                </span>
              )}
            </div>

            <button
              onClick={() => onNavigateToForms(activeSupplier.id, 'risk_eval')}
              className="text-emerald-700 font-medium hover:underline flex items-center gap-1"
            >
              <span>查看歷次風險評估表單歷史</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Modal: Interactive 5D Audit Adjustment */}
      {isEditing5D && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  實地稽核五維度評分調整
                </h3>
                <div className="text-xs text-slate-500">
                  受稽對象：{activeSupplier.name} ({activeSupplier.code})
                </div>
              </div>
              <button
                onClick={() => setIsEditing5D(false)}
                className="text-slate-400 hover:text-slate-600 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Calculated Risk Preview */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">即時綜合評分</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {currentCalc.overallScore} 分
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500">推估風險燈號</span>
                <div className="mt-0.5">
                  <span
                    className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                      RISK_CONFIG[currentCalc.riskLevel].badgeColor
                    }`}
                  >
                    {currentCalc.label} · {currentCalc.action}
                  </span>
                </div>
              </div>
            </div>

            {/* 5 Sliders */}
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">1. 人 (有機概念 / 作業法規與零容忍意識)</span>
                  <span className="font-mono font-bold text-slate-900">{editHuman} 分</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={editHuman}
                  onChange={(e) => setEditHuman(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">2. 事 (矯正預防 / 抽驗異常 CAPA 改善落實)</span>
                  <span className="font-mono font-bold text-slate-900">{editMatter} 分</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={editMatter}
                  onChange={(e) => setEditMatter(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">3. 時 (高風險時間 / 鄰田用藥期與天候雨季防範)</span>
                  <span className="font-mono font-bold text-slate-900">{editTime} 分</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={editTime}
                  onChange={(e) => setEditTime(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">4. 地 (田區風險 / 鄰田緩衝帶隔離與獨立水源)</span>
                  <span className="font-mono font-bold text-slate-900">{editPlace} 分</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={editPlace}
                  onChange={(e) => setEditPlace(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-700">5. 物 (資材風險 / 外購堆肥來源與噴灑桶共用清洗)</span>
                  <span className="font-mono font-bold text-slate-900">{editMaterial} 分</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={editMaterial}
                  onChange={(e) => setEditMaterial(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  訪查紀錄與處置建議備註
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                  placeholder="請輸入田間防護設施狀況、資材查核結果..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing5D(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSave5D}
                className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
              >
                儲存評估結果
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
