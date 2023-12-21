/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { TodoFooter } from './components/footer/TodoFooter';
import { Errors } from './components/Errors/Errors';
import { TodoRenderList } from './components/main/TodoRenderList';
import { TodoHeader } from './components/header/Header';
import { appContext } from './components/Context/Context';

export const App: React.FC = () => {
  const { USER_ID, todos } = useContext(appContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {!!todos.length && (
          <>
            <TodoRenderList />
            <TodoFooter />
          </>
        )}
      </div>

      <Errors />
    </div>
  );
};
