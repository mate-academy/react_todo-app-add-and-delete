import React, {
  ChangeEvent,
  FormEvent,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isTodoLoading: boolean;
  FormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  todoTitle: string
  setTodoTitle: (input: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodoTitle,
  FormSubmit,
  todoTitle,
  isTodoLoading,
}) => {
  const isToggleButtonVisible = todos.every(todo => todo.completed);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
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
        onSubmit={FormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isTodoLoading}
        />
      </form>
    </header>
  );
};
