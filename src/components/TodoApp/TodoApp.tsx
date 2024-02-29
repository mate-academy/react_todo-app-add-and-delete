/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from '../../UserWarning';
import { TodoContext } from '../../context/TodoContext';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Error } from '../Error';
import { USER_ID } from '../../constans/UserId';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  const activeTodosCount = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const completedTodosIds = todos
    .filter(({ completed }) => completed)
    .map(({ id }) => id);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!(todos.length || tempTodo) && <TodoList tempTodo={tempTodo} />}

        {!!todos.length && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosIds={completedTodosIds}
          />
        )}
      </div>

      <Error />
    </div>
  );
};
