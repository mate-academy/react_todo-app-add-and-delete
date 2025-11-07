import { FormEvent, forwardRef, Ref, useState } from 'react';

type Props = {
  onError: (error: string) => void;
  onFormSubmit: (newTitle: string, reset: () => void) => void;
};

export const TodoForm = forwardRef<HTMLInputElement, Props>(
  ({ onError, onFormSubmit }, ref: Ref<HTMLInputElement>) => {
    const [title, setTitle] = useState('');

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = title.trim();

      if (trimmedTitle.length === 0) {
        onError('Title should not be empty');

        return;
      }

      onFormSubmit(trimmedTitle, () => setTitle(''));
    };

    return (
      <form onSubmit={event => handleFormSubmit(event)}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    );
  },
);

TodoForm.displayName = 'TodoForm';
