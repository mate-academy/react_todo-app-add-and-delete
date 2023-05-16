/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { USER_ID } from './App.constants';

import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage';

import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/FilterEnum';
import { TodoForm } from './components/TodoForm.tsx';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    }
  }, []);

  const addTodo = useCallback(async (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  const closeError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const filteredTodos = useMemo(() => {
    const visibleTodos = [...todos];

    switch (filter) {
      case Filter.ACTIVE:
        return visibleTodos.filter((todo) => !todo.completed);
      case Filter.COMPLETED:
        return visibleTodos.filter((todo) => todo.completed);
      default:
        return visibleTodos;
    }
  }, [filter, todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="todoapp__toggle-all active" />

          <TodoForm
            addTodo={addTodo}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
        />

        {todos.length !== 0 && (
          <TodoFooter
            todoCounter={todos.length}
            filterTodos={filter}
            setFilterTodos={setFilter}
          />
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          onClose={closeError}
        />
      )}
    </div>
  );
};
