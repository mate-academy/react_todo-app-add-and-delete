import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';

type Props = {
  onAdd: (todoTitle: string) => void,
  creating: boolean
};

export const Header: React.FC<Props> = React.memo(
  ({ onAdd, creating }) => {
    const [todoTitle, setTodoTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!creating) {
        setTodoTitle('');
        inputRef.current?.focus();
      }
    }, [creating]);

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      onAdd(todoTitle);
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button type="button" className="todoapp__toggle-all active" />

        <form
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={({ target }) => setTodoTitle(target.value)}
            disabled={creating}
          />
        </form>
      </header>
    );
  },
);
