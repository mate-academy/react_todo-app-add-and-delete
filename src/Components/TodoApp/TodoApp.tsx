import './style.scss';
import { useContext } from 'react';
import { USER_ID } from '../../utils/userId';
import { ErrorMessage } from '../ErrorMessage';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { TodoItem } from '../TodoItem';
import { TodoList } from '../TodoList';
import { UserWarning } from '../UserWarning';
import { TodosContext } from '../GlobalStateProvier';

export const TodoApp: React.FC = () => {
  const { todos, tempTodo, error } = useContext(TodosContext);

  return USER_ID ? (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isTemp
              />
            )}

            <Footer />
          </>
        )}
      </div>

      {error
        && (
          <ErrorMessage />
        )}
    </div>
  ) : <UserWarning />;
};
