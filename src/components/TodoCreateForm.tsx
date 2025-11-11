import { FormEvent, forwardRef, useState } from 'react';
import { TodosServiceErrors, todosServiceErrorText } from '../api/todos';

type Props = {
  onSubmit: (title: string, resetTitle: () => void) => void;
  onError: (error: string) => void;
};

export const TodoCreateForm = forwardRef<HTMLInputElement, Props>(
  ({ onSubmit, onError }, ref) => {
    const [newTitle, setNewTitle] = useState('');

    const handleResetTitle = () => setNewTitle('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = newTitle.trim();

      if (!trimmedTitle) {
        onError(
          todosServiceErrorText[TodosServiceErrors.TITLE_SHOULD_NOT_BE_EMPTY],
        );

        return;
      }

      onSubmit(trimmedTitle, handleResetTitle);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
        />
      </form>
    );
  },
);

TodoCreateForm.displayName = 'TodoCreateForm';
