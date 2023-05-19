import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { HeaderTodoApp } from './components/HeaderTodoApp';
import { MainTodoApp } from './components/MainTodoApp';
import {
  addTodo, deleteTodo, getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { FooterTodoApp } from './components/FooterTodoApp';
import { Filter } from './types/Filter';
import { ErrorComponent } from './components/ErrorComponent';
import { USER_ID } from './userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  const loadTodos = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
    setTempTodo(null);
  }, []);

  const visibleTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (category) {
      case Filter.Completed:
        return completed;
      case Filter.Active:
        return !completed;
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
    }

    loadTodos();
  }, []);

  const removeTodo = useCallback(async (todoData: Todo) => {
    try {
      setTempTodo(todoData);
      await deleteTodo(todoData.id);
    } catch {
      setError('Unable to delete a todo');
      setTempTodo(null);
    }

    loadTodos();
  }, []);

  const deleteCompletedTodo = useCallback(() => {
    todos
      .filter(({ completed }) => completed === true)
      .map(todo => removeTodo(todo));
  }, []);

  useEffect(() => {
    loadTodos();
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
          onCreate={createTodo}
          tempTodo={tempTodo}
          onError={setError}
        />

        <MainTodoApp
          todos={visibleTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <FooterTodoApp
            todos={todos}
            category={category}
            onChange={setCategory}
            onDelete={deleteCompletedTodo}
          />
        )}
      </div>

      {error && (
        <ErrorComponent error={error} onError={setError} />
      )}
    </div>
  );
};
