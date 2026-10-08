import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';

type Props = {
  onAdd: (title: string) => Promise<boolean>;
  isSubmitting: boolean;
};

export type NewTodoHandle = {
  focus: () => void;
};

export const NewTodo = React.forwardRef<NewTodoHandle, Props>(
  ({ onAdd, isSubmitting }, ref) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!isSubmitting) {
        inputRef.current?.focus();
      }
    }, [isSubmitting]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        await onAdd('');

        return;
      }

      const success = await onAdd(trimmedTitle);

      if (success) {
        setTitle('');
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    );
  },
);

NewTodo.displayName = 'NewTodo';

NewTodo.propTypes = {
  onAdd: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
