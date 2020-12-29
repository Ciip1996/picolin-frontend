// @flow

/** Generic action creator for sync actions */
export function makeActionCreator(type: string, ...argNames: any[]): any {
  return (...args: any[]) => {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}
