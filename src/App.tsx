/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { HeaderInput } from './components/HeaderInput/HeaderInput';

export const App: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderInput />

        <TodoList />

        <Footer />
      </div>

      <ErrorNotification />
    </div>
  );
};
