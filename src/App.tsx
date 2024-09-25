import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import * as todoService from './api/todos';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { SortBy } from './types/SortBy';
import { showErrorMesage } from './utils/showErrorMesage';

export const App: React.FC = () => {
  //#region States
  //Todos states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);

  //Service states
  const [selectedSort, setSelectedSort] = useState<SortBy>(SortBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  //Header constans
  const [todoTitle, setTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);

  //FooterList
  const [deletingListId, setDeletingListId] = useState<number[]>([]);
  //#endregion

  //#region Functions
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const sortList = (sort: SortBy) => {
    switch (sort) {
      case SortBy.Active:
        return todos.filter(todo => !todo.completed);
      case SortBy.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const sortedArray = sortList(selectedSort);

  function addTodos(title: string, completed: boolean, userId: number) {
    const newTempTodo: Todo = {
      id: 0,
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setLoading(true);
    setLoadingTodo(newTempTodo);
    setErrorMessage('');

    return todoService
      .createTodo({ title, completed, userId })
      .then(newTodo => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, newTodo]);
        setLoadingTodo(null);
      })
      .catch(er => {
        showErrorMesage('Unable to add a todo', setErrorMessage);
        setLoadingTodo(null);
        throw er;
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => handleFocusInput(), 0);
      });
  }

  const reset = () => {
    setErrorMessage('');
    setTodoTitle('');
  };

  //#endregion

  //#region useEffect
  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(er => {
        showErrorMesage('Unable to load todos', setErrorMessage);
        throw er;
      });
  }, []);

  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todosState={{ todos, setTodos }}
          titleState={{ todoTitle, setTodoTitle }}
          reset={reset}
          inputRef={inputRef}
          isDeleting={isDeleting}
          loading={loading}
          addTodos={addTodos}
          setErrorMessage={setErrorMessage}
        />

        <TodoList
          sortedArray={sortedArray}
          loadingTodo={loadingTodo}
          errorFunction={setErrorMessage}
          deletingFunction={setIsDeleting}
          deletingListId={deletingListId}
          todosFunction={setTodos}
          todos={todos}
          focusInput={handleFocusInput}
        />

        {!!todos.length && (
          <Footer
            sortFunction={setSelectedSort}
            todos={todos}
            howSort={selectedSort}
            todosFunction={setTodos}
            errorFunction={setErrorMessage}
            focusInput={handleFocusInput}
            deletingFunction={setIsDeleting}
            deletingListFunction={setDeletingListId}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
