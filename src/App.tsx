import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, postTodos, deleteTodos } from './api/todos';
import { TodoList } from './Components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './Components/Footer/Footer';
import { FilterStatus } from './types/FilterStatus';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorNotification } from './Components/ErrorNotification';
import { getCountOfCompletedTodos } from './utils/getCountOfCompletedTodos';
import { ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [newTitle, setNewTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAllDeleting, setIsAllDeleting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlerErrorShow = (error: ErrorMessage): void => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        handlerErrorShow(ErrorMessage.LoadError);
      })
      .finally(() => {
        setTempTodo(null);
        setNewTitle('');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handlerAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      handlerErrorShow(ErrorMessage.TitleError);
      setIsLoading(false);

      return;
    }

    const newTodo: Todo = {
      id: todos.length + 1,
      completed: false,
      userId: USER_ID,
      title: normalizedTitle,
    };

    const temporaryTodo = { ...newTodo, id: 0 };

    setTempTodo(temporaryTodo);

    postTodos(newTodo)
      .then(() => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        handlerErrorShow(ErrorMessage.AddingError);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handlerDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    deleteTodos(todoId)
      .then(() => {
        {
          setTodos(prevTodo =>
            prevTodo.filter((todo: Todo) => todo.id !== todoId),
          );
        }
      })
      .catch(() => {
        handlerErrorShow(ErrorMessage.DeletingError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerDeleteCompletedTodos = () => {
    setIsAllDeleting(prev => !prev);
    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteTodo(todo.id);
      }
    });
  };

  const handlerSetFilter = (filterSet: FilterStatus): void => {
    setFilterBy(filterSet);
  };

  const handlerErrorMessage = (message: string): void => {
    setErrorMessage(message);
  };

  const visibleTodos = getFilteredTodos(todos, filterBy);
  const counterTodos = getCountOfCompletedTodos(todos);
  const countOfActiveTodos = todos.length - counterTodos;

  if (!USER_ID) {
    return <UserWarning />;
  }

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
          <form onSubmit={handlerAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            currentTodos={visibleTodos}
            temporaryTodo={tempTodo}
            onDeleteTodo={handlerDeleteTodo}
            allTodosDeleting={isAllDeleting}
          />
        </section>

        {!!todos.length && (
          <Footer
            onSetFilter={handlerSetFilter}
            completedTodoCounts={counterTodos}
            activeTodoCounts={countOfActiveTodos}
            selectedFilter={filterBy}
            onDeleteCompletedPosts={handlerDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        messageError={errorMessage}
        setMessageError={handlerErrorMessage}
      />
    </div>
  );
};
