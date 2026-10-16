import { SupplierGrade, RiskLevel, Organic5DScore } from '../types';

/**
 * 總契約達成率換算評級規範：
 * A 級 ≧ 65%
 * B 級 50% ~ 64%
 * C 級 < 50%
 */
export function calculateGradeFromContractRate(contractRate: number): SupplierGrade {
  if (contractRate >= 65) return 'A';
  if (contractRate >= 50) return 'B';
  return 'C';
}

/**
 * 年度考核評分矩陣權重計算：
 * - 專員自評：配合度 (20%) + 發展潛力 (15%) = 35%
 * - 採購自評：品質與規格 (25%) = 25%
 * - 系統客觀數據：總契約達成率 (25%) + 主力類別達成率 (15%) = 40%
 */
export function calculateWeightedTotalScore(
  cooperationScore: number,
  potentialScore: number,
  qualityScore: number,
  contractRate: number,
  mainCategoryRate: number
): number {
  const score =
    cooperationScore * 0.2 +
    potentialScore * 0.15 +
    qualityScore * 0.25 +
    contractRate * 0.25 +
    mainCategoryRate * 0.15;
  return Math.round(score * 10) / 10;
}

/**
 * 有機完整性五維度風險評估計算：
 * 人(有機概念)、事(矯正預防)、時(高風險時間)、地(田區風險)、物(資材風險)
 * 低風險 ≧ 80 (例行追蹤)
 * 中風險 60 ~ 79 (加強查核)
 * 高風險 < 60 (專案查核與管制)
 */
export function calculateOrganicRisk(
  human: number,
  matter: number,
  time: number,
  place: number,
  material: number
): { overallScore: number; riskLevel: RiskLevel; label: string; action: string } {
  const avg = Math.round(((human + matter + time + place + material) / 5) * 10) / 10;
  
  if (avg >= 80) {
    return {
      overallScore: avg,
      riskLevel: 'low',
      label: '低風險',
      action: '例行追蹤',
    };
  }
  if (avg >= 60) {
    return {
      overallScore: avg,
      riskLevel: 'medium',
      label: '中風險',
      action: '加強查核',
    };
  }
  return {
    overallScore: avg,
    riskLevel: 'high',
    label: '高風險',
    action: '專案查核與供應管制',
  };
}

export const GRADE_CONFIG: Record<SupplierGrade, { label: string; color: string; bg: string; border: string; desc: string }> = {
  A: {
    label: 'A 級（優良合作）',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: '總契約達成率 ≧ 65%（優良合作、量產主打、享有優先配額）',
  },
  B: {
    label: 'B 級（穩定合作）',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: '總契約達成率 50% ~ 64%（穩定合作、常態合約，由專員加強品質輔導）',
  },
  C: {
    label: 'C 級（改善觀察）',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    desc: '總契約達成率 < 50%（改善觀察、專案輔導，評估減量或暫緩續約）',
  },
};

export const RISK_CONFIG: Record<RiskLevel, { label: string; action: string; badgeColor: string; dotColor: string; bg: string }> = {
  low: {
    label: '低風險',
    action: '例行追蹤',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50/50',
  },
  medium: {
    label: '中風險',
    action: '加強查核',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-500',
    bg: 'bg-amber-50/50',
  },
  high: {
    label: '高風險',
    action: '專案查核與供應管制',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    dotColor: 'bg-rose-500',
    bg: 'bg-rose-50/50',
  },
};
