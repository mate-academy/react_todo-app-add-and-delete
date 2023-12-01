import React from 'react';
import { TodoApp } from './components/TodoApp/TodoApp';
import {
  GlobalStateProvier,
} from './components/GlobalStateProvider/GlobalStateProvider';

const USER_ID = 11983;

export const App: React.FC = () => (
  <GlobalStateProvier>
    <TodoApp USER_ID={USER_ID} />
  </GlobalStateProvier>
);
