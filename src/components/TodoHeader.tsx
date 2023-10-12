import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  onTodoAdd: (title: string) => Promise<void> | null,
  onToggleAllClick: () => void,
  isAnyTodos: boolean,
  isToggleActive: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  onTodoAdd,
  onToggleAllClick,
  isAnyTodos,
  isToggleActive,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const titleInput = useRef<HTMLInputElement | null>(null);
  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAdding(true);
    const prom = onTodoAdd(todoTitle);

    if (prom) {
      prom
        .then(() => {
          setTodoTitle('');
        })
        .catch(e => {
          // eslint-disable-next-line no-console
          console.log(e);
        });
    }

    setIsAdding(false);
  };

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {isAnyTodos && (
        <button
          type="button"
          aria-label="toddle"
          className={
            cn(
              'todoapp__toggle-all',
              { active: isToggleActive },
            )
          }
          data-cy="ToggleAllButton"
          onClick={onToggleAllClick}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          ref={titleInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
          disabled={isAdding}
        />
      </form>
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </header>
  );
};
