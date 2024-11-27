import { type Ref } from 'vue';
import { message } from '@/utils/common';

interface Weights {
  [key: string]: number | null;
}

interface Scores {
  [key: string]: number | null;
}

export function useWeightScore(weights: Ref<Weights>, scores: Ref<Scores>) {
  const handleReset = () => {
    weights.value = Object.keys(weights.value).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {} as Weights);

    scores.value = Object.keys(scores.value).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {} as Scores);
  };

  const handleValidate = () => {
    const values = Object.values(weights.value).map((val) => Number(val));
    const totalWeight = values.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0);

    if (totalWeight / 100 !== 1) {
      message.error('权重比例加总必须等于100%');
      return false;
    }

    for (const score of Object.values(scores.value)) {
      if (score === null || score <= -1 || score >= 1) {
        message.error('每项得分必须在-1到1之间');
        return false;
      }
    }
    return true;
  };

  const handleWeightInput = (e: Event, field: string) => {
    const value = (e.target as HTMLInputElement).value;
    const numValue = Number(value);
    weights.value[field] = numValue;
  };

  return {
    handleReset,
    handleValidate,
    handleWeightInput
  };
}
