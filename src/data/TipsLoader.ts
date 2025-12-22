import { tipsMap } from './tipsMap';

export interface Tip {
  id: string;
  title: string;
  content: string;
  eloId: number;
}

export class TipsLoader {
  static getTipsForElo(eloKey: string): any {
    return tipsMap[eloKey] || null;
  }
}
