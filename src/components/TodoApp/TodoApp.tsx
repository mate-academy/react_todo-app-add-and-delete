import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { TodoList } from '../TodoList';
import { apiClient } from '../../api/todos';
import { useTodosContext } from '../store';
import { ErrorOption } from '../../enum/ErrorOption';
import { TodoFooter } from '../TodoFooter';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

const USER_ID = 12027;

export const TodoApp: React.FC = () => {
  const {
    todos,
    addTodo,
    hasError,
    setError,
    recieveTodos,
    resetHasError,
  } = useTodosContext();

  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isPostRequest, setIsPostRequest] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    resetHasError();

    apiClient.getTodos(USER_ID)
      .then(todosFS => {
        recieveTodos(todosFS);
      })
      .catch(() => setError(ErrorOption.RecivingError))
      .finally(() => setIsLoading(false));
  }, [resetHasError, recieveTodos, setError]);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      setError(ErrorOption.TitleError);

      return;
    }

    setIsPostRequest(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    });

    const newTodo = {
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    apiClient.postTodo(newTodo)
      .then(newTodoFS => {
        addTodo(newTodoFS);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        setError(ErrorOption.AddTodoError);
        setTempTodo(null);
      })
      .finally(() => {
        setIsPostRequest(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            aria-label="toggleAll"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={onSubmitForm}>
            <input
              data-cy="NewTodoField"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isPostRequest}
            />
          </form>
        </header>
        {!isLoading && <TodoList />}
        {!!tempTodo && (
          <TodoItem todo={tempTodo} />
        )}

        {todos.length > 0 && (
          <TodoFooter
            handlerErrors={
              (errMessage: ErrorOption) => setError(errMessage)
            }
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !hasError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          aria-label="hideErrorBtn"
          type="button"
          className="delete"
          onClick={resetHasError}
        />
        {hasError}
      </div>
    </div>
  );
};
