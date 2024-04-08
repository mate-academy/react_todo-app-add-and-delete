/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { StateContext } from './store/Store';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const { todos } = useContext(StateContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setTempTodo={setTempTodo} />
        <TodoList tempTodo={tempTodo} />
        {todos.length > 0 && <Footer />}
      </div>
      <ErrorNotification />
    </div>
  );
};
