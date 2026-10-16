export type SupplierGrade = 'A' | 'B' | 'C';
export type RiskLevel = 'low' | 'medium' | 'high'; // 低風險 (例行追蹤), 中風險 (加強查核), 高風險 (專案查核與管制)

export interface Organic5DScore {
  human: number; // 人 (有機概念 / 經營者與員工法規意識、農藥零容忍認知) 0-100
  matter: number; // 事 (矯正預防 / 歷次抽驗、不合格品改善措施與落實度 CAPA) 0-100
  time: number; // 時 (高風險時間 / 鄰田用藥盛期、雨季病害高發期、轉型期) 0-100
  place: number; // 地 (田區風險 / 鄰田緩衝帶距離、空飄農藥威脅、水源專屬性) 0-100
  material: number; // 物 (資材風險 / 外購堆肥來源審查、資材清冊、噴灑機共用清洗) 0-100
  overallScore: number; // 綜合評分
  notes: string;
  lastEvaluatedDate: string;
}

export interface SupplierCertificate {
  id: string;
  name: string; // 證書名稱 (如：有機農產品驗證證書)
  certNumber: string;
  issuer: string; // 驗證機構 (如：慈心、成大、環球)
  expireDate: string;
  daysRemaining: number;
  status: 'valid' | 'warning' | 'urgent' | 'expired';
}

export interface Supplier {
  id: string;
  code: string; // e.g. "SUP-2026-A01"
  name: string; // e.g. "慈耕楊文正"
  representative: string;
  region: '北部' | '中部' | '南部' | '東部';
  address: string;
  phone: string;
  crops: string[]; // 主力作物
  certifiedOrganic: boolean;
  totalAreaHectares: number;
  
  // 年度考核評分矩陣
  contractRate: number; // 總契約達成率 (%) - 關鍵分級指標 (A>=65%, B:50-64%, C:<50%)
  mainCategoryRate: number; // 主力類別達成率 (%)
  qualityScore: number; // 採購自評 (品質與規格) 0-100
  cooperationScore: number; // 專員自評 (配合度) 0-100
  potentialScore: number; // 專員自評 (發展潛力) 0-100
  weightedTotalScore: number; // 綜合考核加權分
  grade: SupplierGrade; // 評級 A / B / C
  
  // 有機完整性五維度風險
  riskLevel: RiskLevel;
  organic5D: Organic5DScore;
  
  // 證書清單
  certificates: SupplierCertificate[];
}

export interface SupervisorAnnouncement {
  id: string;
  title: string;
  author: string;
  role: string;
  date: string;
  priority: 'normal' | 'important' | 'urgent';
  content: string;
  tags: string[];
}

export interface MeetingTask {
  id: string;
  title: string;
  meetingDate: string;
  category: '產發會議' | '採購例會' | '食安稽核' | '農友座談';
  assignee: string; // 專員姓名
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  notes: string;
}

export type FormType = 'annual_eval' | 'risk_eval' | 'price_change' | 'new_item_change';

export interface AdminFormRecord {
  id: string;
  formType: FormType;
  title: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'closed'; // 暫存區 (draft) 與 結案區 (closed)
  applicant: string;
  createdAt: string;
  updatedAt: string;
  autoSavedAt: string;
  summary: string;
  data: {
    contractRate?: number;
    proposedGrade?: SupplierGrade;
    evalReason?: string;
    risk5DValues?: { human: number; matter: number; time: number; place: number; material: number };
    priceOld?: number;
    priceNew?: number;
    itemVariety?: string;
    unitPrice?: number;
    estimatedMonthlyVolume?: number;
    changeReason?: string;
    effectiveDate?: string;
    comments?: string;
  };
}

export type FieldReportType = 
  | 'planting' // 種植回報
  | 'yield' // 產出預報
  | 'supplier_update' // 供應商資料更新
  | 'procurement_forecast' // 採購預報
  | 'quality_capa'; // 品異互動與改善

export interface FieldReportRecord {
  id: string;
  type: FieldReportType;
  supplierId: string;
  supplierName: string;
  date: string;
  inspector: string;
  fieldPlot: string; // 田區地號
  locationCoords: string; // GPS 座標
  details: {
    cropName: string;
    variety: string;
    areaHectares?: number;
    plantingDate?: string;
    expectedHarvestDate?: string;
    estimatedYieldKg?: number;
    qualityGrade?: '特級' | '優級' | '良級';
    anomalyReason?: string;
    farmerAction?: string;
    inspectorVerification?: string;
    seasonalNotes?: string;
  };
  photoNote?: string;
  verified: boolean;
}
