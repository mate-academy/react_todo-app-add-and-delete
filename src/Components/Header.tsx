import { useEffect, useRef } from 'react';
import { USER_ID } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  setQuery: (title: string) => void;
  title: string;
  addTodo: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (message: ErrorTypes | null) => void;
  responding: boolean;
  allCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  setQuery,
  title,
  addTodo,
  setErrorMessage,
  responding,
  allCompleted,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!responding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [responding]);

  const titleChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const formSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const newTitle = title.trim();

    const newTodo = {
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };
    const reset = () => setQuery('');

    if (newTitle.length === 0) {
      setErrorMessage(ErrorTypes.invalidTitle);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    addTodo(newTodo).then(reset);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={formSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={titleChangeHandle}
          autoFocus
          disabled={responding}
        />
      </form>
    </header>
  );
};
