/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Header } from './components/header';
import { TodoList } from './components/todos';
import { Error } from './components/error';
import { Filter } from './components/filter';
import { FilterOptions } from './types/FilterOptions';

const USER_ID = 10995;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [
    filterMethod,
    setFilterMethod,
  ] = useState<FilterOptions>(FilterOptions.ALL);
  const [isHidden, setIsHidden] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setError('Error: cannot upload todos'));
  }, []);

  useEffect(() => {
    let errorTimer: number;
    let hiddenTime: number;

    if (error) {
      hiddenTime = window.setTimeout(() => {
        setIsHidden(true);
      }, 2000);
      errorTimer = window.setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(hiddenTime);
    };
  }, [error]);

  const completedTodos = todos.filter((todo) => todo.completed === true);
  const activeTodos = todos.filter((todo) => todo.completed !== true);

  const visibleTodos: Todo[] = useMemo(() => {
    switch (filterMethod) {
      case FilterOptions.ACTIVE:
        return activeTodos;

      case FilterOptions.COMPLETED:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filterMethod]);

  const addTodo = async (title: string) => {
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

      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add todo');
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const deleteComplededTodos = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
    } catch {
      setError('Unable to delete todos');
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        <section className="todoapp__main">
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodos={loadingTodos}
            deleteTodo={deleteTodo}
          />
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {todos.filter(todo => !todo.completed).length}
              {' '}
              items left
            </span>

            <Filter filter={filterMethod} setFilter={setFilterMethod} />

            {completedTodos.length > 0 && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={deleteComplededTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}

        {(error) && (
          <Error error={error} setError={setError} isHidden={isHidden} />
        )}
      </div>
    </div>
  );
};
