/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/todo';
import { FilteringOptions } from './types/Filter';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Filter } from './components/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Notifications } from './components/Notifications';

const USER_ID = 10921;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilteringOptions>(FilteringOptions.all);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to get todos'));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleAddTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const addedTodo = await addTodo(newTodo);

      setTodos(curTodos => [...curTodos, addedTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevTodoIds => [...prevTodoIds, todoId]);
      await deleteTodo(todoId);
      setTodos(curTodosIds => curTodosIds.filter(t => t.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodos([0]);
    }
  };

  const handleClearCompletedTodos = async () => {
    const deletedTodos = completedTodos.map(todo => handleDeleteTodo(todo.id));

    try {
      await Promise.all(deletedTodos);
    } catch {
      setError('Unable to clear completed todos');
    }
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilteringOptions.active:
        return activeTodos;

      case FilteringOptions.completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          onAdd={handleAddTodo}
          tempTodo={tempTodo}
        />
        <TodoList
          todos={visibleTodos}
          onDelete={handleDeleteTodo}
          loadingTodos={loadingTodos}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <Filter
              filter={filter}
              setFilter={setFilter}
            />

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClearCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>
      <Notifications
        error={error}
        setError={setError}
      />
    </div>
  );
};
