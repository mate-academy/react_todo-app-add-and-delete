/* eslint-disable jsx-a11y/control-has-associated-label */
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { useTodos } from './context/TodosContext';

export const App: React.FC = () => {
  const { todos, filterStatus, tempTodo } = useTodos();

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList
          todos={todos}
          filterStatus={filterStatus}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
