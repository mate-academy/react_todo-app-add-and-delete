import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './Header.scss';
import classNames from 'classnames';
import { HeaderHandle } from '../../types/HeaderHandle';

type Props = {
  isAllCompleted: boolean;
  onAdd: (title: string) => Promise<void>;
  toggleComplete: (isAllCompleted: boolean) => void;
};

export const Header = React.memo(
  React.forwardRef<HeaderHandle, Props>(function Header(
    { isAllCompleted, onAdd, toggleComplete },
    ref,
  ) {
    const [query, setQuery] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusInput() {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!isInputDisabled) {
        inputRef.current?.focus();
      }
    }, [isInputDisabled]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (isInputDisabled) {
        return;
      }

      setIsInputDisabled(true);

      onAdd(query)
        .then(() => {
          setQuery('');
        })
        .finally(() => {
          setIsInputDisabled(false);
        });
    }

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleComplete(isAllCompleted)}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            name="title"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={event => {
              if (!isInputDisabled) {
                setQuery(event.target.value);
              }
            }}
            ref={inputRef}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  }),
);
