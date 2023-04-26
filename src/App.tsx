import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, FilterType } from './types/Todo';
import { AddInput } from './components/AddInput/AddInput';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoList } from './components/TodoList';
import { AddError } from './components/AddError/AddError';
import { getTodos, deleteTodos, postTodos } from './api/todos';
import { TodoItem } from './components/TodoItem';
import { createTitle } from './utils/helpers';

const USER_ID = 7025;

export const App: React.FC = () => {
  const [todos, setTodo] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disInput, setDisInput] = useState<boolean>(false);

  const fetchData = async () => {
    const todosFromServer = await getTodos(USER_ID);

    try {
      setTodo(todosFromServer);
    } catch {
      setError('Unable to load a todo');

      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterTodo = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterType) {
        case FilterType.ALL:
          return todo;

        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  const handleAddTodo = async (title: string) => {
    try {
      setDisInput(true);
      setTempTodo(createTitle(title));

      const data = {
        userId: USER_ID,
        title,
        completed: false,
      };

      const newTodo = await postTodos(data);

      setTodo(todo => [...todo, newTodo]);
    } catch {
      setError('Unable to add a todo');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setTempTodo(null);
      setDisInput(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodos(id);
      const currentTodo = todos.filter((todo) => todo.id !== id);

      setTodo(currentTodo);
      setError('');
    } catch {
      setError('Unable to delete a todo');

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddInput
          disInput={disInput}
          handleAddTodo={handleAddTodo}
          setError={setError}
        />

        <TodoList
          todos={filterTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFilter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
      </div>

      {error && (
        <AddError
          error={error}
        />
      )}
    </div>
  );
};
