import { RefObject, useEffect, useState } from 'react';
import * as todoService from '../../utils/helpers';
import { Todo } from '../../types/Todo';
import { errorMessages, TEMP_TODO } from '../../utils/const';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: (update: (todos: Todo[]) => Todo[]) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  inputRef: RefObject<HTMLInputElement>;
};
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setHasError,
  setTempTodo,
  setIsLoading,
  isLoading,
  inputRef,
}) => {
  const [title, setTitle] = useState<string>('');

  const compleatedTodos = todos.every(todo => todo.completed);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedTitle = title.trim();

    if (title.trim()) {
      setTempTodo({ ...TEMP_TODO, title: title });
      setIsLoading(true);
      todoService.addTodo(
        { title: trimedTitle, userId: 1318, completed: false },
        setTodos,
        setIsLoading,
        setTempTodo,
        setTitle,
        setHasError,
        setErrorMessage,
      );
    } else {
      setErrorMessage(errorMessages.emptyError);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: compleatedTodos,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isLoading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
