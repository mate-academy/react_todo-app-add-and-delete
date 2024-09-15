/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from '../../UserWarning';
import { TodoContext } from '../../context';
import { USER_ID } from '../../constants/constans';
import { TodoList } from '../TodoList';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Error } from '../Error';

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
