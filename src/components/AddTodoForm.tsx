import { FormEventHandler, forwardRef, useCallback, useState } from 'react';
import { getTodoError, TodosServiceError } from '../api/todos';

export type AddTodoFormData = {
  title: string;
};

type AddTodoFormProps = {
  onSubmit: (value: AddTodoFormData, clear: () => void) => void;
  onError: (notification: string) => void;
};

export const AddTodoForm = forwardRef<HTMLInputElement, AddTodoFormProps>(
  ({ onSubmit, onError }, ref) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const clearTodoTitle = useCallback(() => setNewTodoTitle(''), []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
      event.preventDefault();

      const prepearedNewTodoTitle = newTodoTitle.trim();

      if (prepearedNewTodoTitle === '') {
        onError(getTodoError(TodosServiceError.TitleShouldNotBeEmpty));

        return;
      }

      onSubmit({ title: prepearedNewTodoTitle }, clearTodoTitle);
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
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value.trimStart())}
        />
      </form>
    );
  },
);

AddTodoForm.displayName = 'AddTodoForm';
