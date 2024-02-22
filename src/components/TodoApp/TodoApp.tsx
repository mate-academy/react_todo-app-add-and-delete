/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import * as postService from '../../api/todos';
import { UserWarning } from '../../UserWarning';
import { Todolist } from '../TodoList';
import { Footer } from '../Footer';
import { Header } from '../Header/Header';
import { ErrorNotification } from '../ErrorNotification.tsx/ErrorNotification';
import { TempTodo } from '../TempTodo/TempTodo';

export const TodoApp: React.FC = () => {
  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <section className="todoapp__main" data-cy="TodoList">
          <div className="todo-list" data-cy="todosList">
            <Todolist />
            <TempTodo />
          </div>
        </section>

        <Footer />
      </div>

      <ErrorNotification />
    </div>
  );
};
