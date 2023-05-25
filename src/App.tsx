/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { Select } from './types/Select';
import { Todo } from './types/Todo';
import { TodoData } from './types/TodoData';
import { client, todoUrlEnd } from './utils/fetchClient';
import { createTodo, deleteTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [select, setSelect] = useState(Select.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const activeTodos = todos.filter(({ completed }) => completed === false);

  const getTodos = useCallback(async () => {
    const data: Todo[] = await client.get(todoUrlEnd);

    setTodos(data);
  }, []);

  const addTodo = useCallback(async (data: TodoData) => {
    try {
      setIsLoading(true);
      setTempTodo({ ...data, id: 0 });
      await createTodo(data);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      getTodos();
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    await deleteTodo(id);
    getTodos();
  }, []);

  const handleSelectedTodos = useMemo(() => {
    let visibleTodos: Todo[] = [...todos];

    switch (select) {
      case Select.Active:
        visibleTodos = visibleTodos.filter(todo => todo.completed === false);
        break;

      case Select.Completed:
        visibleTodos = visibleTodos.filter(todo => todo.completed === true);
        break;

      case Select.All:
      default:
        break;
    }

    return visibleTodos;
  }, [todos, select]);

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          onError={setErrorMessage}
          isLoading={isLoading}
        />

        <TodoList
          todos={handleSelectedTodos}
          onRemove={removeTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            onSelect={setSelect}
            activeTodos={activeTodos}
            select={select}
          />
        )}
      </div>

      {errorMessage && (
        <Notification
          message={errorMessage}
          handleError={setErrorMessage}
        />
      )}
    </div>
  );
};
