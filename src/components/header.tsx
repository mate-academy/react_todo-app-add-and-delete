import { useEffect, useRef } from 'react';
import { USER_ID } from '../api/todos';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todoTitle: string;
  setTodoTitle: (text: string) => void;
  addTodo: ({ userId, title, completed }: Omit<Todo, 'id'>) => void;
  allActive: boolean;
  setErrorMessage: (text: string) => void;
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  todoTitle,
  setTodoTitle,
  addTodo,
  allActive,
  setErrorMessage,
  loading,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [loading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTodoTitle(event.target.value);
  };

  const handleTitleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!todoTitle.trim()) {
        setErrorMessage('Title should not be empty');
      }

      if (todoTitle.trim()) {
        addTodo({
          userId: USER_ID,
          title: todoTitle.trim(),
          completed: false,
        });
      }
    }

    if (event.key === 'Escape') {
      setTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allActive })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
          onKeyDown={handleTitleEnter}
          ref={titleField}
          disabled={loading}
        />
      </form>
    </header>
  );
};
