import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosApi from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { getFilteredTodos } from './utils/getFilterTodos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { wait } from './utils/fetchClient';
import { Error } from './components/Error';
import { countIncompleteItems } from './utils/countIncompleteItems';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const titleFild = useRef<HTMLInputElement>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
    wait(3000).then(() => {
      setErrorMessage('');
    });
  };

  useEffect(() => {
    todosApi
      .getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(`Unable to load todos`);
      });
  }, [errorMessage]);

  useEffect(() => {
    if (!tempTodo) {
      titleFild.current?.focus();
    }
  }, [tempTodo]);

  const deleteTodo = (id: number) => {
    setErrorMessage('');
    setLoadingIds(prevIds => [...prevIds, id]);

    return todosApi
      .deleteTodos(id)
      .then(() =>
        setTodos(todo => todo.filter(todoItem => todoItem.id !== id)),
      )
      .catch(() => {
        handleError(`Unable to delete a todo`);
      })
      .finally(() => {
        setLoadingIds(prevIds =>
          prevIds.filter(prevId => prevId !== id),
        );
        titleFild.current?.focus();
      });
  };

  const visibleTodos = getFilteredTodos([...todos], filter);

  if (!todosApi.USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = todoTitle.trim();

    if (!normalizedTitle) {
      handleError(`Title should not be empty`);

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle.trim(),
      completed: false,
      userId: 0,
    });

    setErrorMessage('');

    todosApi
      .createTodos(normalizedTitle)
      .then(newTodo => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
        setTodoTitle('');
      })
      .catch(() => {
        handleError(`Unable to add a todo`);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={titleFild}
              value={todoTitle}
              onChange={e => setTodoTitle(e.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            itemsLeft={countIncompleteItems(todos)}
            filter={filter}
            setFilter={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
