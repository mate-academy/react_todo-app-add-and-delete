/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { USER_ID } from './variables/UserID';
import { TodosContext } from './TodoContext/TodoContext';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const {
    todos,
  } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && (<Footer />)}
      </div>

      <Error />
    </div>
  );
};
