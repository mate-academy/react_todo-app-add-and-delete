/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
  onAdd: (title: string) => Promise<void>;
  onToggleAll: () => Promise<void>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  todosCount: { active: number; completed: number };
}

export const Header: FC<Props> = ({
  onAdd,
  onToggleAll,
  inputRef,
  todosCount,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await onAdd(title);
      setTitle('');
    } catch {
      // eslint-disable-next-line no-console
      console.log('Error adding todo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, loading]);

  return (
    <header className="todoapp__header">
      {(todosCount.active > 0 || todosCount.completed > 0) && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosCount.active === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          disabled={loading}
          onChange={({ target }) => setTitle(target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
