import React from 'react';
import { Todo } from '../../types/Todo';

interface NewTodoProps {
  focusedInput: React.Ref<HTMLInputElement>;
  onTitleChange?: (title: Todo['title']) => void;
  todoTitle: Todo['title'];
  onEnterKeyPressed: (event: React.KeyboardEvent) => void;
  isDisabled: boolean;
}
export const NewTodo: React.FC<NewTodoProps> = ({
  focusedInput,
  onTitleChange = () => {},
  todoTitle,
  onEnterKeyPressed,
  isDisabled,
}) => {
  return (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={focusedInput}
        value={todoTitle}
        onChange={event => onTitleChange(event.target.value)}
        onKeyDown={onEnterKeyPressed}
        disabled={isDisabled}
      />
    </form>
  );
};
