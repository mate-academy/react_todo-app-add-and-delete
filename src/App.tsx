/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { FilterType } from './types/FilterType';

const USER_ID = 10824;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [errorType, setErrorType] = useState('');
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [indexUpdatedTodo, setIndexUpdatedTodo] = useState(0);

  const fetchData = async () => {
    try {
      const newTodos = await getTodos(USER_ID);

      setTodos(newTodos);
    } catch (error) {
      setErrorType('Unable to load todos');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorType('');
    }, 3000);
  }, [errorType]);

  const onChangeQuery = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const getVisibleTodo = (filter: FilterType, todosArr: Todo[]) => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todosArr.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todosArr.filter(todo => todo.completed);
      default:
        return todosArr;
    }
  };

  const deleteErrorMessage = () => {
    setErrorType('');
  };

  const visibleTodos = getVisibleTodo(filterType, todos);

  const hasCompleted = visibleTodos.some(todo => todo.completed);

  (function handleTempTodo() {
    if (tempTodo) {
      visibleTodos.splice(indexUpdatedTodo, 1, tempTodo);
    }
  }());

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorType("Title can't be empty");

      return;
    }

    setLoading(true);
    setQuery('');

    const maxId = Math.max(...todos.map(({ id }) => id), 0);
    const newTodo: Todo = {
      id: 0,
      title: query.trim(),
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);
    setIndexUpdatedTodo(visibleTodos.length);

    try {
      await postTodo(USER_ID, {
        id: maxId + 1,
        title: query.trim(),
        userId: USER_ID,
        completed: false,
      });
      fetchData();
      setTempTodo(null);
      setErrorType('');
    } catch (error) {
      setErrorType('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todo: Todo, indexTodo: number) => {
    setIndexUpdatedTodo(indexTodo);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todo.title,
      completed: todo.completed,
    });

    try {
      await removeTodo(todo.id);
      setTempTodo(null);
      fetchData();
    } catch (error) {
      setErrorType('Unable to delete todo');
      setTempTodo(null);
    }
  };

  const clearCompleted = async (event: React.MouseEvent) => {
    event.preventDefault();
    const completedTodo = todos.filter(todo => todo.completed);

    try {
      completedTodo.map(todo => removeTodo(todo.id));
      fetchData();
    } catch {
      setErrorType('Unable to clear completed a todo');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          onChangeQuery={onChangeQuery}
          addTodo={addTodo}
          loading={loading}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          indexUpdatedTodo={indexUpdatedTodo}
          deleteTodo={deleteTodo}
        />

        {!!todos.length && (
          <Footer
            itemsLeft={itemsLeft}
            filterType={filterType}
            setFilterType={setFilterType}
            hasCompleted={hasCompleted}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {!!errorType.length && (
        <div className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: errorType.length === 0,
          },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={deleteErrorMessage}
          />
          {errorType}
        </div>
      )}
    </div>
  );
};
