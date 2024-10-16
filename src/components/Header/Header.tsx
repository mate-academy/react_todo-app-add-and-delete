import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import cn from 'classnames';

type Props = {
  todosAmount: number;
  uncompletedTodosAmount: number;
  isLoading: boolean;
  title: string;
  onTitleChange: Dispatch<SetStateAction<string>>;
  onSubmit: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  todosAmount,
  uncompletedTodosAmount,
  isLoading,
  title,
  onTitleChange,
  onSubmit,
}) => {
  const createTodoInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(title);
  };

  useEffect(() => {
    if (createTodoInput.current) {
      createTodoInput.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {!!todosAmount && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !!uncompletedTodosAmount,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={createTodoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={title}
          onChange={event => onTitleChange(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
