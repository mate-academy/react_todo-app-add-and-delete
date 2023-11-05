import React, { useContext } from 'react';

import './TodoApp.scss';

import { StateContext } from '../TodoStore';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { TodosError } from './TodosError';

export const TodoApp: React.FC = () => {
  const { initialTodos } = useContext(StateContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList />

        {!!initialTodos.length && (
          <TodoFooter />
        )}
      </div>

      <TodosError />
    </div>
  );
};
