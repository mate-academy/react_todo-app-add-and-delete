/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useTodoContext } from './Context/Context';
import { TodoHeader } from './Components/Header/TodoHeader/TodoHeader';
import { ErrorNotification } from './Components/ErrorNotification/ErrorNotification';
import { TodoFooter } from './Components/Footer/TodoFooter/TodoFooter';
import { TodoForRender } from './Components/Main/TodoForRender/TodoForRender';

export const App: React.FC = () => {
  const { renderedTodos } = useTodoContext();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoHeader />
      <div className="todoapp__content">
        <TodoForRender />

        {renderedTodos.length !== 0 && <TodoFooter />}
      </div>
      <ErrorNotification />
    </div>
  );
};
