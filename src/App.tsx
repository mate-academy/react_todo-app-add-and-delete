import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, FilterType } from './types/Todo';
import { AddInput } from './components/AddInput/AddInput';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Loading } from './components/isLoading';
import { TodoList } from './components/TodoList';
import { AddError } from './components/AddError/AddError';
import {
  getTodo,
  deleteTodo,
  postTodo,
  updateTodo,
} from './api/todos';
import { TodoItem } from './components/TodoItem';
import { createTitle } from './utils/helpers';

const USER_ID = 7025;

export const App: React.FC = () => {
  const [todos, setTodo] = useState<Todo []>([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisableInput, setIsDisableInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const completedTodos = todos.every(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const fetchData = async () => {
    const todosFromServer = await getTodo(USER_ID);

    try {
      setTodo(todosFromServer);
      setIsLoading(false);
    } catch {
      setError('Unable to load a todo');
      setIsLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsDisableInput(true);
      setTempTodo(createTitle(title));

      const data = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      const newTodo = await postTodo(data);

      setTodo(todo => [...todo, newTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsDisableInput(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      const currentTodo = todos.filter((todo) => todo.id !== id);

      setTodo(currentTodo);
      setError('');
    } catch {
      setError('Unable to delete a todo');
    }
  };

// Im working here

  // const handleToggleAll = async () => {
  //   if (completedTodos) {
  //     todos.forEach(todo => {
  //       updateTodo(todo.id, { completed: false });
  //     });
  //   } else {
  //     activeTodos.forEach(todo => {
  //       updateTodo(todo.id, { completed: true });
  //     });
  //   }
  // };

  // const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
  // };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading
        ? <Loading />
        : (
          <div className="todoapp__content">
            <AddInput
              isDisableInput={isDisableInput}
              handleAddTodo={handleAddTodo}
              setError={setError}
              handleToggleAll={handleToggleAll}
              completedTodos={completedTodos}
            />

            <TodoList
              todos={filterTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
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
        )}

      {error && (
        <AddError
          error={error}
        />
      )}
    </div>
  );
};
