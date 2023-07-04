/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorMessage } from './components/ErrorMessage';
import { StatusFilterType } from './types/StatusFilterType';
import { StatusFilter } from './components/StatusFilter';

const USER_ID = 10897;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(StatusFilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Loading todos failed'));
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case StatusFilterType.COMPLETED:
        return completedTodos;

      case StatusFilterType.ACTIVE:
        return activeTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const handleCloseError = () => {
    setError(null);
  };

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const showTitleError = (erorMessage: string) => {
    setError(erorMessage);
  };

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodo(prevTodoId => [...prevTodoId, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  }, []);

  const handleclearCompletedTodo = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />
          <TodoForm
            onAddTodo={addTodo}
            onShowInputError={showTitleError}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onRemoveTodo={removeTodo}
          tempTodo={tempTodo}
          loadingTodo={loadingTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <StatusFilter filter={filter} onChangeFilter={setFilter} />

            {completedTodos && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleclearCompletedTodo}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <ErrorMessage error={error} onCloseError={handleCloseError} />
    </div>
  );
};
