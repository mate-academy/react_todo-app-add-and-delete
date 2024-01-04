/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState, FC } from 'react';
import { UserWarning } from './UserWarning';
import { ErrorMessage }
  from './components/ErrorMessage/ErrorMessage';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { filterTodos } from './dataHelpers';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { Error } from './types/Error';
import { Footer } from './components/Footer/Footer';

const USER_ID = 12051;

export const App: FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const deleteTodo = async (id: number) => {
    setLoadingTodosIds(prev => [...prev, id]);
    todoService.deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => showError(Error.NotDelete))
      .finally(() => {
        setLoadingTodosIds(
          prev => prev.filter(loadingId => loadingId !== id),
        );
      });
  };

  const addTodo = (titleTodo: string): Promise<void> => {
    setTempTodo({
      title: titleTodo,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    return todoService.addTodo({
      title: titleTodo,
      userId: USER_ID,
      completed: false,
    }).then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(() => showError(Error.NotAdd))
      .finally(() => setTempTodo(null));
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(Error.NotLoad));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filterStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header addTodo={addTodo} showError={showError} />
        <TodoList
          deleteTodo={deleteTodo}
          todos={filteredTodos}
          tempTodo={tempTodo}
          loadingTodosIds={loadingTodosIds}
        />

        {todos.length > 0 && (
          <Footer
            filterStatus={filterStatus}
            filteredTodos={filteredTodos}
            setFilterStatus={setFilterStatus}
          />
        )}

      </div>
      {errorMessage && (
        <ErrorMessage errorMessage={errorMessage} />
      )}
    </div>
  );
};
