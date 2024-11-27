export interface BWeights {
  b_salary_weight: number | null;
  b_career_weight: number | null;
  b_wl_balance_weight: number | null;
  b_life_persp_weight: number | null;
}

export interface BScores {
  b_salary_score: number | null;
  b_career_score: number | null;
  b_wl_balance_score: number | null;
  b_life_persp_score: number | null;
}

export interface PWeights {
  p_stablecomp_weight: number | null;
  p_skill_weight: number | null;
  p_industry_weight: number | null;
  p_culture_weight: number | null;
}

export interface PScores {
  p_stablecomp_score: number | null;
  p_skill_score: number | null;
  p_industry_score: number | null;
  p_culture_score: number | null;
}
