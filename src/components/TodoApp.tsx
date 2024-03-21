import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from '../UserWarning';
import { USER_ID, getTodos } from '../api/todos';
import { ErrorMessage, FilterBy, Todo } from '../types';
import { TodoList } from './TodoList';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  ErrorMessageContext,
  InputFieldRefContextProvider,
  IsDeletingCompletedContextProvider,
  SetErrorMessageContext,
  SetTodosContext,
  TodosContext,
} from '../Contexts';

export const TodoApp: React.FC = () => {
  const [filterBy, setFilterBy] = useState('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);
  const errorMessage = useContext(ErrorMessageContext);
  const setErrorMessage = useContext(SetErrorMessageContext);

  const todosToShow = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.load);
      });
  }, [setTodos, setErrorMessage]);

  useEffect(() => {
    setErrorMessage(ErrorMessage.noError);
  }, [todos, setErrorMessage]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(ErrorMessage.noError);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [errorMessage, setErrorMessage]);

  const handleFilterClick = (e: React.MouseEvent) => {
    setFilterBy(e.currentTarget.innerHTML);
  };

  const handleHideErrorMessage = useCallback(() => {
    setErrorMessage(ErrorMessage.noError);
  }, [setErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <InputFieldRefContextProvider>
          <Header setTempTodo={setTempTodo} />
          {(todos.length !== 0 || tempTodo !== null) && (
            <IsDeletingCompletedContextProvider>
              <TodoList todosToShow={todosToShow} tempTodo={tempTodo} />
              <Footer
                filterBy={filterBy}
                handleFilterClick={handleFilterClick}
              />
            </IsDeletingCompletedContextProvider>
          )}
        </InputFieldRefContextProvider>
      </div>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="hide error"
          onClick={handleHideErrorMessage}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
