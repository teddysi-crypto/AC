import React, { useState } from 'react';
import { Supplier, FieldReportRecord, FieldReportType } from '../types';
import { 
  Navigation, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  UserCog, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  History, 
  ShieldCheck, 
  Star, 
  Layers, 
  Clock 
} from 'lucide-react';

interface FieldInspectionProps {
  suppliers: Supplier[];
  fieldReports: FieldReportRecord[];
  onAddFieldReport: (newReport: FieldReportRecord) => void;
}

export const FieldInspection: React.FC<FieldInspectionProps> = ({
  suppliers,
  fieldReports,
  onAddFieldReport,
}) => {
  const [activeReportType, setActiveReportType] = useState<FieldReportType>('planting');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  
  // Historical Inspection Pre-Visit Data Banner
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [showPreVisitData, setShowPreVisitData] = useState<boolean>(true);

  // Field Inputs
  const [fieldPlot, setFieldPlot] = useState<string>('南投縣埔里鎮大湳段 128-2 地號 (第 3 號高床溫室)');
  const [gpsCoords, setGpsCoords] = useState<string>('23.9738° N, 120.9821° E');
  const [cropName, setCropName] = useState<string>('有機彩色甜椒');
  const [variety, setVariety] = useState<string>('荷蘭橘豹 F1');
  const [areaHectares, setAreaHectares] = useState<number>(0.8);
  const [plantingDate, setPlantingDate] = useState<string>('2026-04-15');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<string>('2026-06-20');
  const [estimatedYieldKg, setEstimatedYieldKg] = useState<number>(5500);
  const [qualityGrade, setQualityGrade] = useState<'特級' | '優級' | '良級'>('特級');
  const [anomalyReason, setAnomalyReason] = useState<string>('到貨批次中裂果率超標 (15%)，果型大小不均');
  const [farmerAction, setFarmerAction] = useState<string>('已調控溫室通風與夜間滴灌頻率，採收前24小時禁水');
  const [inspectorVerification, setInspectorVerification] = useState<string>('現場複驗棚內果實轉色飽滿，同意恢復常態供貨');
  const [seasonalNotes, setSeasonalNotes] = useState<string>('端午連假生鮮促銷主打，建議配合每週供貨 1,200 kg');
  const [photoNote, setPhotoNote] = useState<string>('植株開花率 85%，根系伸展健壯，防護網室無破損。');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Virtual "所在地導航" button action
  const handleVirtualNavigation = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
      setShowPreVisitData(true);
      setFieldPlot(`${selectedSupplier.address} (已鎖定所在地田區)`);
      setGpsCoords('23.9738° N, 120.9821° E');
      showToast(`📍 所在地導航已鎖定【${selectedSupplier.name}】！自動帶出歷史評估資料。`);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: FieldReportRecord = {
      id: `REP-2026-${String(fieldReports.length + 80 + 1).padStart(3, '0')}`,
      type: activeReportType,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      date: new Date().toISOString().split('T')[0],
      inspector: '林志明 (產銷專員)',
      fieldPlot,
      locationCoords: gpsCoords,
      details: {
        cropName,
        variety,
        areaHectares,
        plantingDate,
        expectedHarvestDate,
        estimatedYieldKg,
        qualityGrade,
        anomalyReason,
        farmerAction,
        inspectorVerification,
        seasonalNotes,
      },
      photoNote,
      verified: true,
    };
    onAddFieldReport(newReport);
    showToast(`已成功提交【${getReportTabTitle(activeReportType)}】紀錄！`);
  };

  const getReportTabTitle = (type: FieldReportType) => {
    switch (type) {
      case 'planting':
        return '種植回報';
      case 'yield':
        return '產出預報';
      case 'supplier_update':
        return '供應商資料更新';
      case 'procurement_forecast':
        return '採購預報';
      case 'quality_capa':
        return '品異互動與改善';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with "所在地導航" Action Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">
                行動訪查與日常供應回報模組
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono">
                Field Operations
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              專員於產地訪查前點選「所在地導航」，系統將自動調出農場歷史考核等級與交貨品質。
              提供<strong>種植回報、產出預報、供應商資料更新、採購預報、品異改善</strong>五大卡片。
            </p>
          </div>

          {/* Virtual Navigation Button */}
          <button
            onClick={handleVirtualNavigation}
            disabled={isNavigating}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            title="點擊模擬產地現場定位，自動帶出訪查前歷史等級與品質評估"
          >
            <Navigation className={`w-4 h-4 ${isNavigating ? 'animate-spin' : ''}`} />
            <span>{isNavigating ? '定位導航中...' : '📍 所在地導航 (帶出歷史評估)'}</span>
          </button>
        </div>
      </div>

      {/* Pre-Visit Historical Assessment Card (Brought out by 所在地導航) */}
      {showPreVisitData && (
        <div className="bg-emerald-50/40 rounded-xl border border-emerald-200 p-4.5 shadow-xs transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-600 text-white rounded-md">
                <History className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900">
                  訪查前歷史等級與品質評估資料：{selectedSupplier.name} ({selectedSupplier.code})
                </span>
                <div className="text-[11px] text-slate-500">
                  {selectedSupplier.region} · 代表人：{selectedSupplier.representative} · {selectedSupplier.phone}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-emerald-800 rounded border border-emerald-300">
                最終等級：{selectedSupplier.grade === 'A' ? 'A 級（優良合作）' : (selectedSupplier.grade === 'B' ? 'B 級（穩定合作）' : 'C 級（改善觀察）')}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 rounded border border-emerald-300">
                有機五維度：{selectedSupplier.riskLevel === 'low' ? '低風險 (例行追蹤)' : (selectedSupplier.riskLevel === 'medium' ? '中風險 (加強查核)' : '高風險 (專案管制)')}
              </span>
            </div>
          </div>

          {/* Quick Metrics Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 text-[10px] block">總契約達成率</span>
              <span className="font-mono font-bold text-sm text-emerald-700">{selectedSupplier.contractRate}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">A級 ≧65% 門檻</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 text-[10px] block">採購品質自評</span>
              <span className="font-mono font-bold text-sm text-slate-800">{selectedSupplier.qualityScore} 分</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">交貨無農藥殘留</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 text-[10px] block">專員自評配合度</span>
              <span className="font-mono font-bold text-sm text-slate-800">{selectedSupplier.cooperationScore} 分</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">到貨準時度高</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 text-[10px] block">發展潛力</span>
              <span className="font-mono font-bold text-sm text-slate-800">{selectedSupplier.potentialScore} 分</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">擴充契作能力</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px] block">主力作物</span>
              <span className="font-bold text-slate-800 line-clamp-1">{selectedSupplier.crops.join('、')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">面積 {selectedSupplier.totalAreaHectares} 公頃</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Reporting Workspace: Left 5 Tabs Form (7 cols) + Right Inspection Log (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 5 Great Daily Supply Reporting Cards */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          
          {/* 5 Tab Selector Header */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-6">
            <button
              type="button"
              onClick={() => setActiveReportType('planting')}
              className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                activeReportType === 'planting'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>1. 種植回報</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveReportType('yield')}
              className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                activeReportType === 'yield'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2. 產出預報</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveReportType('supplier_update')}
              className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                activeReportType === 'supplier_update'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>3. 資料更新</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveReportType('procurement_forecast')}
              className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                activeReportType === 'procurement_forecast'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>4. 採購預報</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveReportType('quality_capa')}
              className={`p-2 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                activeReportType === 'quality_capa'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>5. 品異改善</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Common Header: Target Supplier & Plot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  契作供應商
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => {
                    const supId = e.target.value;
                    setSelectedSupplierId(supId);
                    const sup = suppliers.find((s) => s.id === supId);
                    if (sup) setFieldPlot(`${sup.address} (田區第一溫室)`);
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden"
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
                  田區地號 / GPS 鎖定點
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fieldPlot}
                    onChange={(e) => setFieldPlot(e.target.value)}
                    className="w-full p-2 pr-8 border border-slate-300 rounded-lg text-xs focus:outline-hidden"
                  />
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* 1. 種植回報 */}
            {activeReportType === 'planting' && (
              <div className="space-y-3 p-3.5 rounded-lg bg-emerald-50/30 border border-emerald-100">
                <span className="font-bold text-slate-800 block">
                  田間定植作業資料
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">作物品名</label>
                    <input
                      type="text"
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">品種與種苗來源</label>
                    <input
                      type="text"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1">定植面積 (公頃)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={areaHectares}
                      onChange={(e) => setAreaHectares(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">定植日期</label>
                    <input
                      type="date"
                      value={plantingDate}
                      onChange={(e) => setPlantingDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">預估採收首日</label>
                    <input
                      type="date"
                      value={expectedHarvestDate}
                      onChange={(e) => setExpectedHarvestDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. 產出預報 */}
            {activeReportType === 'yield' && (
              <div className="space-y-3 p-3.5 rounded-lg bg-blue-50/30 border border-blue-100">
                <span className="font-bold text-slate-800 block">
                  近期採收量預估與品質分級
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">預計採收日期</label>
                    <input
                      type="date"
                      value={expectedHarvestDate}
                      onChange={(e) => setExpectedHarvestDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">預估採收總量 (kg)</label>
                    <input
                      type="number"
                      value={estimatedYieldKg}
                      onChange={(e) => setEstimatedYieldKg(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">預估品質規格</label>
                    <select
                      value={qualityGrade}
                      onChange={(e) => setQualityGrade(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-medium"
                    >
                      <option value="特級">特級 (外銷 / 精品有機超市)</option>
                      <option value="優級">優級 (常規連鎖量販規格)</option>
                      <option value="良級">良級 (團膳與加工契作)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">出貨與冷鏈排程備註</label>
                  <input
                    type="text"
                    value={seasonalNotes}
                    onChange={(e) => setSeasonalNotes(e.target.value)}
                    placeholder="說明每日出貨箱數、預冷庫存與交車時間..."
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* 3. 供應商資料更新 */}
            {activeReportType === 'supplier_update' && (
              <div className="space-y-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">
                  基本資料、田區地號與聯絡資訊更新
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">主要聯絡電話</label>
                    <input
                      type="text"
                      defaultValue={selectedSupplier.phone}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">契作登記總面積 (公頃)</label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={selectedSupplier.totalAreaHectares}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">農友通訊與田區地址</label>
                  <input
                    type="text"
                    defaultValue={selectedSupplier.address}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* 4. 採購預報 */}
            {activeReportType === 'procurement_forecast' && (
              <div className="space-y-3 p-3.5 rounded-lg bg-amber-50/30 border border-amber-100">
                <span className="font-bold text-slate-800 block">
                  各通路檔期採購需求預報調配
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">檔期活動名稱</label>
                    <input
                      type="text"
                      defaultValue="五月母親節生鮮專案 / 端午檔期"
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">預計收購配額需求 (kg)</label>
                    <input
                      type="number"
                      defaultValue={1800}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">通路分貨與包裝規範要求</label>
                  <input
                    type="text"
                    defaultValue="指定 250g 盒裝貼標，低溫冷藏 4°C 專車直發雙北理貨中心。"
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* 5. 品異互動與改善 */}
            {activeReportType === 'quality_capa' && (
              <div className="space-y-3 p-3.5 rounded-lg bg-rose-50/30 border border-rose-100">
                <span className="font-bold text-slate-800 block">
                  品質異常檢討與農友改善措施 (CAPA)
                </span>
                <div>
                  <label className="block text-slate-600 mb-1">到貨不良或品保抽檢異常原因</label>
                  <input
                    type="text"
                    value={anomalyReason}
                    onChange={(e) => setAnomalyReason(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">農友現地因應改善對策</label>
                  <textarea
                    rows={2}
                    value={farmerAction}
                    onChange={(e) => setFarmerAction(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">專員複查驗證結論</label>
                  <textarea
                    rows={2}
                    value={inspectorVerification}
                    onChange={(e) => setInspectorVerification(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Field Notes Input Box */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block font-medium text-slate-700 mb-1">
                現場訪查紀錄備註
              </label>
              <textarea
                rows={2}
                value={photoNote}
                onChange={(e) => setPhotoNote(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                placeholder="記錄田區氣溫、水質抽檢、植株生長狀況..."
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>立即提交回報</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right: Field Inspection Log Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                📋 田間訪查與日常供應回報動態 ({fieldReports.length} 筆)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">即時同步</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {fieldReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white transition-all text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-900">{report.supplierName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                      {getReportTabTitle(report.type)}
                    </span>
                  </div>

                  <div className="text-slate-600 text-[11px] mb-2 line-clamp-2">
                    {report.type === 'planting' && (
                      <span>
                        定植：{report.details.cropName} ({report.details.variety}) · 面積 {report.details.areaHectares} 公頃 · 預收 {report.details.expectedHarvestDate}
                      </span>
                    )}
                    {report.type === 'yield' && (
                      <span>
                        預報：{report.details.cropName} 預計採收 {report.details.estimatedYieldKg} kg · 分級：{report.details.qualityGrade}
                      </span>
                    )}
                    {report.type === 'supplier_update' && (
                      <span>{report.details.seasonalNotes}</span>
                    )}
                    {report.type === 'procurement_forecast' && (
                      <span>{report.details.seasonalNotes}</span>
                    )}
                    {report.type === 'quality_capa' && (
                      <span>
                        異常：{report.details.anomalyReason} · 改善：{report.details.farmerAction}
                      </span>
                    )}
                  </div>

                  {report.photoNote && (
                    <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-500 italic mb-2">
                      "{report.photoNote}"
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>專員：{report.inspector}</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>支援斷線離線登打與背景上傳</span>
            <span className="text-emerald-700 font-medium">✓ 已完成所在地坐標對齊</span>
          </div>
        </div>

      </div>

    </div>
  );
};
