import React, {
  FC,
  Dispatch,
  useEffect,
  useRef,
  useState,
  SetStateAction,
} from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  isAddingTodo: boolean;
  errorMessage: Errors;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  handleAddTodo: (
    { title, userId, completed }: Omit<Todo, 'id'>,
    setTitle: Dispatch<SetStateAction<string>>,
  ) => void;
};
export const Header: FC<Props> = ({
  todos,
  setErrorMessage,
  handleAddTodo,
  isAddingTodo,
  errorMessage,
}) => {
  const [title, setTitle] = useState('');

  const areTodosAllCompleted = todos.every(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart();

    setTitle(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage(Errors.EMPTY_TITLE);
      inputRef.current?.focus();

      return;
    }

    handleAddTodo(
      {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      },
      setTitle,
    );
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: areTodosAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={handleInputChange}
          disabled={isAddingTodo}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
