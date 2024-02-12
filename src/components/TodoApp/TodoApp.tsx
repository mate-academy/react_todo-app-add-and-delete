import React, { useContext } from 'react';

import { StateContext } from '../Context/StateContext';
import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';
import { Notification } from './Notification';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo } = useContext(StateContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header />

      {(todos.length > 0 || tempTodo) && (
        <>
          <Main />
          <Footer />
        </>
      )}

      <Notification />
    </div>
  );
};
