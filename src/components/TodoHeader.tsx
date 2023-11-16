import cn from 'classnames';

import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onError: (error: string) => void
  onTodoAdd: (title: string) => Promise<void>
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onError,
  onTodoAdd,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isButtonActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmiting]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmiting(true);
    onError('');

    if (!title.trim()) {
      onError('Title should not be empty');
      setIsSubmiting(false);

      return;
    }

    await onTodoAdd(title.trim())
      .then(() => setTitle(''))
      .finally(() => {
        setIsSubmiting(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });

    // try {
    //   await onTodoAdd(title.trim());
    //   setTitle('');
    // } finally {
    //   setIsSubmiting(false);
    //   setTimeout(() => {
    //     inputRef.current?.focus();
    //   }, 0);
    // }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isButtonActive,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
