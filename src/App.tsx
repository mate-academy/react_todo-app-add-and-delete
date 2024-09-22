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
  const [sortedTodos, setSortedTodos] = useState<Todo[]>([]);
  const [loadingTodo, setLoadingTodo] = useState<Todo | null>(null);

  //Service states
  const [selectedSort, setSelectedSort] = useState<SortBy>(SortBy.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  //Header constans
  const [todoTitle, setTodoTitle] = useState('');

  //FooterList
  const [deletingListId, setDeletingListId] = useState<number[]>([]);
  // const [deletingList, setDeletingList] = useState(false);

  //#endregion

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const sortList = (sort: SortBy) => {
    switch (sort) {
      case SortBy.Active:
        setSortedTodos(todos.filter(todo => !todo.completed));
        break;
      case SortBy.Completed:
        setSortedTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setSortedTodos(todos);
        break;
    }
  };

  //#region useEffect
  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(er => {
        showErrorMesage('Unable to load todos', setErrorMessage);
        throw er;
      });
  }, [todos]);

  useEffect(() => {
    sortList(selectedSort);
  }, [todos, selectedSort]);

  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          titleText={todoTitle}
          titleFunction={setTodoTitle}
          errorFunction={setErrorMessage}
          todosFunction={setTodos}
          loadingTodoFunction={setLoadingTodo}
          inputRef={inputRef}
          isDeleting={isDeleting}
        />

        <TodoList
          sortedTodos={sortedTodos}
          loadingTodo={loadingTodo}
          errorFunction={setErrorMessage}
          deletingFunction={setIsDeleting}
          deletingListId={deletingListId}
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
