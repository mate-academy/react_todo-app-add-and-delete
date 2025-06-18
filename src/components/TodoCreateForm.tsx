import {
  Dispatch,
  FormEvent,
  forwardRef,
  SetStateAction,
  useState,
} from 'react';
import { TodoError, TodoServiceError } from '../api/todos';

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
        onError(TodoServiceError.TitleShouldNotBeEmpty);
        return;
      }

      onSubmit(normalizedTitle)
        .then(() => setNewTitle(''))
        .catch(() => {});
    };
    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={ref}
          autoFocus
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
