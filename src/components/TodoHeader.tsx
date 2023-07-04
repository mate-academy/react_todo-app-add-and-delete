import React, {
  ChangeEvent,
  FormEvent,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  inputValue: string
  setInputValue: (input: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setInputValue,
  handleSubmit,
  inputValue,
  isLoading,
}) => {
  const isToggleButtonVisible = todos.every(todo => todo.completed);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isToggleButtonVisible,
        })}
        aria-label="todoapp__toggle-all"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
