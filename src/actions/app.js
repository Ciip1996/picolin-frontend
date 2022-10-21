import { makeActionCreator } from './index';

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';
export const SIGNIN_USER = 'SIGNIN_USER';

export const SHOW_CONFIRMATION = 'SHOW_CONFIRMATION';
export const HIDE_CONFIRMATION = 'HIDE_CONFIRMATION';

export const showAlert = makeActionCreator(SHOW_ALERT, 'payload');
export const hideAlert = makeActionCreator(HIDE_ALERT, 'payload');
export const signinUser = makeActionCreator(SIGNIN_USER, 'payload');

export const confirm = makeActionCreator(SHOW_CONFIRMATION, 'payload');
export const closeConfirmation = makeActionCreator(HIDE_CONFIRMATION);
