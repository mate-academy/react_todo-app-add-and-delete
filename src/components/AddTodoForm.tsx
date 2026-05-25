import { FormEventHandler, forwardRef, useCallback, useState } from 'react';
import { getTodoError, TodosServiceError } from '../api/todos';

export type AddTodoFormData = {
  title: string;
};

type AddTodoFormProps = {
  onSubmit: (value: AddTodoFormData, clear: () => void) => void;
  onError: (notification: string) => void;
  loading: boolean;
};

export const AddTodoForm = forwardRef<HTMLInputElement, AddTodoFormProps>(
  ({ onSubmit, onError, loading }, ref) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');

    const clearTodoTitle = useCallback(() => setNewTodoTitle(''), []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
      event.preventDefault();

      const preparedNewTodoTitle = newTodoTitle.trim();

      if (preparedNewTodoTitle === '') {
        onError(getTodoError(TodosServiceError.TitleShouldNotBeEmpty));

        return;
      }

      onSubmit({ title: preparedNewTodoTitle }, clearTodoTitle);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
          autoFocus
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value.trimStart())}
        />
      </form>
    );
  },
);

AddTodoForm.displayName = 'AddTodoForm';
