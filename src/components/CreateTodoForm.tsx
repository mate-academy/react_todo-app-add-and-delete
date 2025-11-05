import { FormEvent, forwardRef, useState } from 'react';
import { TodosErrorsService, todosErrorsServiceText } from '../api/todos';

type CreateTodoFormProps = {
  onSubmit: (title: string, resetTitle: () => void) => void;
  onError: (errorMessage: string) => void;
};

export const CreateTodoForm = forwardRef<HTMLInputElement, CreateTodoFormProps>(
  ({ onSubmit, onError }, ref) => {
    const [newTitle, setNewTitle] = useState('');

    const handleResetTitle = () => setNewTitle('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimedTitle = newTitle.trim();

      if (!trimedTitle) {
        onError(
          todosErrorsServiceText[TodosErrorsService.TITLE_SHOULD_NOT_BE_EMPTY],
        );

        return;
      }

      onSubmit(newTitle, handleResetTitle);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
        />
      </form>
    );
  },
);

CreateTodoForm.displayName = 'CreateTodoForm';
