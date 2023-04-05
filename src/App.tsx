import React, {
  useContext,
} from 'react';
import { AppContext } from './components/AppProvider';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const { todos, userId, isTodosLoading } = useContext(AppContext);

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header />

        {isTodosLoading && (
          <Loader />
        )}

        <TodoList />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <Notification />
    </div>
  );
};
