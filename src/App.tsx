import { FC } from 'react';
import {
  Header, TodoList, Footer, Errors, UserWarning,
} from './components';
import { useAppContext } from './context/AppContext';
import { USER_ID } from './USER_ID';

export const App: FC = () => {
  const { todos } = useAppContext();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {
          todos.length > 0 && (
            <>
              <TodoList />
              <Footer />
            </>
          )
        }
      </div>

      <Errors />
    </div>
  );
};
