import { Action } from './Action';
import { State } from './State';

export interface InitialContextData {
  state: State;
  dispatch: React.Dispatch<Action>;
}
