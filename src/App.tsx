/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { FilterSetting } from './types/FilterSetting';

interface FilterParams {
  filterBy: FilterSetting;
}

const prepareFilterTodos = (todos: Todo[], { filterBy }: FilterParams) => {
  const filteredTodos = [...todos];

  switch (filterBy) {
    case 'FilterLinkAll':
      return filteredTodos;
    case 'FilterLinkActive':
      return filteredTodos.filter(todo => !todo.completed);
    case 'FilterLinkCompleted':
      return filteredTodos.filter(todo => todo.completed);
    default:
      return filteredTodos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterSetting>('FilterLinkAll');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(
    () => prepareFilterTodos(todos, { filterBy }),
    [todos, filterBy],
  );

  const lenghtOfTodos = todos.length;

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');

        throw error;
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const activeTodos = useMemo(() => {
    return todos.reduce((prev: number, item) => {
      return !item.completed ? prev + 1 : prev;
    }, 0);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.reduce((prev: number, item) => {
      return item.completed ? prev + 1 : prev;
    }, 0);
  }, [todos]);

  const addLoadingId = (id: number) => {
    setLoadingIds(prevIds => [...prevIds, id]);
  };

  const removeLoadingId = (id: number) => {
    setLoadingIds(prevIds => prevIds.filter(loadingId => loadingId !== id));
  };

  const addTodo = ({ id, ...data }: Todo) => {
    setErrorMessage('');

    return todoService
      .postTodo(data)
      .then(newTodo => {
        setTodos(currTodos => [...currTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    addLoadingId(todoId);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));

        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => removeLoadingId(todoId));
  };

  const deleteCompletedTodo = () => {
    Promise.allSettled(
      todos
        .filter(todo => todo.completed)
        .map(todo => {
          return deleteTodo(todo.id);
        }),
    );
  };

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={lenghtOfTodos}
          userId={todoService.USER_ID}
          onSubmit={addTodo}
          onError={setErrorMessage}
          onTemp={setTempTodo}
          inputRef={inputRef}
        />

        <TodoList
          todosFromServer={filteredTodos}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
        />

        {/* Hide the footer if there are no todos */}
        {lenghtOfTodos !== 0 && (
          <Footer
            onFilter={setFilterBy}
            filter={filterBy}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            onDeleteCompleted={deleteCompletedTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
