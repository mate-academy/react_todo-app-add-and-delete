/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo } from './api/todos';
import { USER_ID } from './utils/constants';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [loading, isLoading] = useState(false);
  const [loadingID, setLoadingID] = useState(0);
  const [comletedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [uncomletedTodoCount, setUncomletedTodoCount] = useState<number>(0);

  const visibleTodos = useMemo(() => {
    let filteredTodos: Todo[] = todos;

    if (filter === Filter.ACTIVE) {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filter === Filter.COMPLETED) {
      filteredTodos = todos.filter(todo => todo.completed);
    }

    return filteredTodos || [];
  }, [filter, todos]);

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingID(todoId);
      isLoading(true);
      await deleteTodo(todoId);
      setTodos((visibleTodos.filter(todo => todo.id !== todoId)));
    } catch {
      setError('Can not delete todo');
    }

    isLoading(false);
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const handleSetError = (errVal: string) => {
    setError(errVal);
  };

  const handleSelectFilter = (filterValue: string) => {
    setFilter(filterValue);
  };

  const handleClearComplitedTodos = () => {
    comletedTodos.map(todo => handleDeleteTodo(todo.id));
    setCompletedTodos([]);
  };

  const loadTodos = async () => {
    try {
      await getTodos(USER_ID)
        .then(res => setTodos(res));
    } catch (err) {
      setError('Can not load todos');
    }
  };

  const updateTodos = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos as Todo[], todo]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setCompletedTodos(todos.filter(todoa => todoa.completed));
    setUncomletedTodoCount(todos.filter(todo => !todo.completed).length);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={handleSetError}
          handleSetTempTodo={handleSetTempTodo}
          userId={USER_ID}
          updateTodos={updateTodos}
        />
        {todos && (
          <>
            <Main
              todos={visibleTodos}
              tempTodo={tempTodo}
              showError={handleSetError}
              handleDeleteTodo={handleDeleteTodo}
              loading={loading}
              loadingID={loadingID}
            />

            <Footer
              setFilter={handleSelectFilter}
              selectedFilter={filter}
              comletedTodos={comletedTodos}
              clearCompletedTodos={handleClearComplitedTodos}
              uncomletedTodoCount={uncomletedTodoCount}
            />
          </>
        )}
      </div>
      {error
      && (
        <Notification
          setError={handleSetError}
          errorText={error}
        />
      )}
    </div>
  );
};
