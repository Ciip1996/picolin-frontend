// @flow

export type Maybe<T> = ?T;

export interface UIState {
  orderBy: string;
  direction: string;
  page: number;
  perPage: number;
  keyword: Maybe<string>;
}
