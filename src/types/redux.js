// @flow

export type Action = {
  type: string,
  payload: any
};

export type State = any;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
export type GetState = () => State;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
