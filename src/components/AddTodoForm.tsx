import { Dispatch, FormEvent, forwardRef, SetStateAction } from 'react';
import { useState } from 'react';
import { TodoError, TodosErrors } from '../api/todos';

interface Props {
  onSubmit: (title: string) => Promise<void>;
  onError: Dispatch<SetStateAction<TodoError | null>>;
}

export const AddTodoForm = forwardRef<HTMLInputElement, Props>(
  ({ onSubmit, onError }, ref) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = newTodoTitle.trim();

      if (!trimmedTitle) {
        onError(TodosErrors.TitleShouldNotBeEmpty);

        return;
      }

      onSubmit(trimmedTitle)
        .then(() => setNewTodoTitle(''))
        .catch(() => {});
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          autoFocus
        />
      </form>
    );
  },
);

AddTodoForm.displayName = 'AddTodoForm';
