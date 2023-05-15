import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { MainTodoApp } from './components/MainTodoApp';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FooterTodoApp } from './components/FooterTodoApp';
import { FILTERS } from './types/FILTERS';
import { ErrorComponent } from './components/ErrorComponent';

const USER_ID = 10299;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState<FILTERS>(FILTERS.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [removingTodoId, setRemovingTodoId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadTodos = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
    setRemovingTodoId(null);
    setTempTodo(null);
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (category) {
      case FILTERS.completed:
        return completed === true;
      case FILTERS.active:
        return completed === false;
      default:
        return true;
    }
  }), [todos, category]);

  const createTodo = useCallback(async (todoData: Todo) => {
    try {
      setTempTodo(todoData);
      await addTodo(todoData);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      loadTodos();
    }
  }, []);

  const removeTodo = useCallback(async (todoData: Todo) => {
    try {
      setRemovingTodoId(todoData.id);
      await deleteTodo(todoData.id);
    } catch {
      setError('Unable to delete a todo');
      setRemovingTodoId(null);
    } finally {
      loadTodos();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodoApp
          todos={todos}
          USER_ID={USER_ID}
          createTodo={createTodo}
          tempTodo={tempTodo}
          setError={setError}
        />

        <MainTodoApp
          todos={visibleTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          removingTodoId={removingTodoId}
        />

        {todos.length > 0 && (
          <FooterTodoApp
            todos={todos}
            category={category}
            onChange={setCategory}
            removeTodo={removeTodo}
          />
        )}
      </div>

      {error && (
        <ErrorComponent error={error} setError={setError} />
      )}
    </div>
  );
};
