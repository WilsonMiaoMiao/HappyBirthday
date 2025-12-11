export enum Category {
  JOY = 'JOY',
  ANGER = 'ANGER',
  SORROW = 'SORROW',
  FEAR = 'FEAR',
  BIRTHDAY = 'BIRTHDAY',
  ANSWERS = 'ANSWERS'
}

export interface QuoteRecord {
  id: string;
  text: string;
  timestamp: number;
}

export type CategoryConfig = {
  [key in Category]: {
    label: string;
    icon: string;
    colorClass: string;
    buttonClass: string;
    title: string;
  };
};