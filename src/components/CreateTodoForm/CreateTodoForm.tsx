import { forwardRef, useState } from 'react';
import { TodoErrorMessage, todoErrorMessageText } from '../../api/todos';
type CreateTodoFormProps = {
  onSubmit: (title: string, clearTitle: () => void) => void;
  onError: (error: string) => void;
};

export const CreateTodoForm = forwardRef<HTMLInputElement, CreateTodoFormProps>(
  ({ onSubmit, onError }, ref) => {
    const [newTitle, setNewTitle] = useState('');

    const handleClearTitle = () => setNewTitle('');

    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = newTitle.trim();

      if (!trimmedTitle) {
        onError(
          todoErrorMessageText[TodoErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY],
        );

        return;
      }

      onSubmit(trimmedTitle, handleClearTitle);
    };

    return (
      <form onSubmit={handleOnSubmit}>
        <input
          ref={ref}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
          autoFocus
        />
      </form>
    );
  },
);

CreateTodoForm.displayName = 'CreateTodoForm';
