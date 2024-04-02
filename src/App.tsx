import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, postTodos, deleteTodos } from './api/todos';
import { TodoList } from './Components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './Components/Footer/Footer';
import { StatesOfFilter } from './types/StatesOfFilter';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { ErrorNotification } from './Components/ErrorNotification';
import { getRandomNumberId } from './utils/getRandomNumberId';
import { getCountOfCompletedTodos } from './utils/getCountOfCompletedTodos';

export const App: React.FC = () => {
  const [newTitle, setNewTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<StatesOfFilter>(StatesOfFilter.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAllDeleting, setIsAllDeleting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlerErrorShow = (error: string): void => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const refetch = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        handlerErrorShow('Unable to load todos');
      })
      .finally(() => {
        setTempTodo(null);
        setNewTitle('');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handlerPostTodo = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!newTitle.trim()) {
      handlerErrorShow('Title should not be empty');
      setIsLoading(false);

      return;
    }

    const newTodo: Todo = {
      id: getRandomNumberId(),
      completed: false,
      userId: USER_ID,
      title: newTitle.trim(),
    };

    const temporaryTodo = { ...newTodo, id: 0 };

    setTempTodo(temporaryTodo);

    postTodos(newTodo)
      .then(() => {
        setTodos([...todos, newTodo]);
        setTempTodo(null);
        setNewTitle('');
      })
      .catch(() => {
        handlerErrorShow('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handlerDeleteOnePost = (todoId: number) => {
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
        handlerErrorShow('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerDeleteCompletedPosts = () => {
    setIsAllDeleting(prev => !prev);
    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteOnePost(todo.id);
      }
    });
  };

  const handlerSetFilter = (filterSet: StatesOfFilter): void => {
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
          <form onSubmit={handlerPostTodo}>
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
            onDeleteTodo={handlerDeleteOnePost}
            allTodosDeleting={isAllDeleting}
          />
        </section>

        {!!todos.length && (
          <Footer
            onSetFilter={handlerSetFilter}
            completedTodoCounts={counterTodos}
            activeTodoCounts={countOfActiveTodos}
            selectedFilter={filterBy}
            onDeleteCompletedPosts={handlerDeleteCompletedPosts}
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
