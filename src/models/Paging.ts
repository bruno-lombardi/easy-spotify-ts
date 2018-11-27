import { SimplifiedTrack } from "./SimplifiedTrack";

export interface Paging {
  href: string;
  items: any[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface PagingTracks extends Paging {
  items: SimplifiedTrack[];
}
