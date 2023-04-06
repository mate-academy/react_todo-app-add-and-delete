import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Notification } from './components/Notification';
import { USER_ID } from './utils/constants';
import { useAppContext } from './components/AppProvider';

export const App: React.FC = () => {
  const { todos, isTodosLoading } = useAppContext();

  if (!USER_ID) {
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

        {todos.length > 0 && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      <Notification />
    </div>
  );
};
