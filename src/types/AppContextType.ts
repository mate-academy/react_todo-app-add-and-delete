import { Dispatch } from 'react';
import { State } from './State';
import { Action } from './Action';

export interface AppContextType {
  state: State;
  dispatch: Dispatch<Action>;
}
