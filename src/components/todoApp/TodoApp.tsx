import React from 'react';
import { TodoList } from './components/main/TodoList';
import { Footer } from './components/footer/footer';
import { Store } from '../../Store';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { TodoInput } from './components/header/TodoInput';

export const TodoApp: React.FC = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Store>
        <div className="todoapp__content">
          <TodoInput />
          <TodoList />
          <Footer />
          <ErrorNotification />
        </div>
      </Store>
    </div>
  );
};
