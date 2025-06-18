import {
  Dispatch,
  FormEvent,
  forwardRef,
  SetStateAction,
  useState,
} from 'react';
import { TodoError, TodoServiceErrors } from '../api/todos';

interface TodoCreateFormProps {
  onSubmit: (title: string) => Promise<void>;
  onError: Dispatch<SetStateAction<TodoError | null>>;
}

export const TodoCreateForm = forwardRef<HTMLInputElement, TodoCreateFormProps>(
  ({ onSubmit, onError }, ref) => {
    const [newTitle, setNewTitle] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedTitle = newTitle.trim();

      if (!normalizedTitle) {
        onError(TodoServiceErrors.TitleShouldNotBeEmpty);

        return;
      }

      onSubmit(newTitle).then(() => setNewTitle(''));
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          autoFocus
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setNewTitle(event.target.value.trimStart())}
        />
      </form>
    );
  },
);

TodoCreateForm.displayName = 'TodoCreateForm';
