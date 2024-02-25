import React, { useContext } from 'react';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { ErrorComponent } from './ErrorComponent';
import { Header } from './Header';
import { TodoContext } from '../context/TodoContext';
import { UserWarning } from '../UserWarning';
import { USER_ID } from '../types/userId';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {!!(todos.length || tempTodo) && <TodoList />}

        {!!todos.length && <Footer />}
      </div>

      <ErrorComponent />
    </div>
  );
};
