import { BRANCHES } from './constants';

export type Branch = typeof BRANCHES[keyof typeof BRANCHES];

export interface Report {
  id: string;
  branch: Branch;
  date: string;
  qty: number;
  amt: number;
  trans: number;
  atv: string;
  upt: string;
  arp: string;
}
