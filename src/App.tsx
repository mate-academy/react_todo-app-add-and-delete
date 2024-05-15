import { FC, useContext } from 'react';

import {
  Header,
  TodoList,
  Footer,
  ErrorNotification,
  TodoInfo,
} from './components';

import { AppContext } from './wrappers/AppProvider';

export const App: FC = () => {
  const { tempTodo } = useContext(AppContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {tempTodo.isLoading && <TodoInfo />}

        <Footer />
      </div>

      <ErrorNotification />
    </div>
  );
};
