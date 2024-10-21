import React from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import classNames from 'classnames';
import { USER_ID, addTodo } from '../../api/todos';
type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  completedTodos: Todo[];
  textField: React.RefObject<HTMLInputElement>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  query: string;
  setQuery: (query: string) => void;
  isInputLoading: boolean;
  setIsInputLoading: (isLoading: boolean) => void;
  setTempTodo: (tempTodo: null | Todo) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  completedTodos,
  textField,
  setErrorMessage,
  query,
  setQuery,
  isInputLoading,
  setIsInputLoading,
  setTempTodo,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setErrorMessage(Error.titleShouldNotBeEmpty);
      setTimeout(() => {
        setErrorMessage(Error.none);
      }, 3000);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    setIsInputLoading(true);
    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(response => {
        setTodos(currentTodos => [...currentTodos, response]);
        setTempTodo(null);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(Error.unableToAdd);
        setTimeout(() => {
          setErrorMessage(Error.none);
        }, 3000);
      })
      .finally(() => {
        setIsInputLoading(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoappheader">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapptoggle-all', {
            active: todos.length === completedTodos.length,
          })}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={textField}
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isInputLoading}
        />
      </form>
    </header>
  );
};
