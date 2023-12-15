import cn from 'classnames';
import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../AppContext';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  isEveryCompleted: boolean
};

export const Header: React.FC<Props> = ({ isEveryCompleted }) => {
  const {
    todoTitle,
    setTodoTitle,
    addTodo,
    setError,
    loadind,
  } = useContext(AppContext);

  const fieldRender = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldRender.current && !fieldRender.current.disabled) {
      fieldRender.current.focus();
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!todoTitle.trim()) {
      setError(ErrorType.titleIsEmpty);

      setTimeout(() => setError(null), 2000);

      return;
    }

    addTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all text-invisible',
          { active: isEveryCompleted },
        )}
        data-cy="ToggleAllButton"
      >
        {' '}
      </button>

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={fieldRender}
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={loadind}
        />
      </form>
    </header>
  );
};
