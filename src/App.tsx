/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
} from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo } from './api/todos';

const USER_ID = 10283;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<boolean | string>(false);
  const [filter, setFilter] = useState<string>('all');
  const [loading, isLoading] = useState(false);
  const [loadingID, setLoadingID] = useState(0);
  const [comletedTodos, setCompletedTodos] = useState<Todo[] | null>(null);
  let visibleTodos: Todo[] | null = todos;

  if (filter === 'active') {
    visibleTodos = todos ? todos.filter(todo => !todo.completed) : null;
  }

  if (filter === 'completed') {
    visibleTodos = todos ? todos.filter(todo => todo.completed) : null;
  }

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingID(todoId);
      isLoading(true);
      await deleteTodo(todoId);
      setTodos((visibleTodos?.filter(todo => todo.id !== todoId) || null));
    } catch {
      setError('delete');
    }

    isLoading(false);
  };

  const handleSetTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const handleSetError = (errVal: string | boolean) => {
    setError(errVal);
  };

  const HandleSelectFilter = (filterValue: string) => {
    setFilter(filterValue);
  };

  const handleClearComplitedTodos = () => {
    // eslint-disable-next-line no-console
    console.log(comletedTodos);
    comletedTodos?.map(todo => handleDeleteTodo(todo.id));
    setCompletedTodos(null);
  };

  const loadTodos = async () => {
    try {
      await getTodos(USER_ID)
        .then(res => setTodos(res));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const updateTodos = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos as Todo[], todo]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (todos) {
      setCompletedTodos(todos?.filter(todoa => todoa.completed));
    }
  }, [todos]);

  // eslint-disable-next-line no-console
  console.log('app renders');

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
              setFilter={HandleSelectFilter}
              selectedFilter={filter}
              comletedTodos={comletedTodos}
              clearComplitedTodos={handleClearComplitedTodos}
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
