import { useContext } from 'react';
import { ErrorNotification } from '../components/ErrorNotification';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { TodoList } from '../components/TodoList';
import { TodosContext } from '../components/todosContext';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length > 0 && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
