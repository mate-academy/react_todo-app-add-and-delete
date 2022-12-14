import React, { useCallback, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

interface Props {
  user: User | null,
  title: string,
  onSetTitle: (newTitle: string) => void,
  onTodoAdd: (todoData: Omit<Todo, 'id'>) => void;
  onSetIsError: (newStatus: boolean) => void;
  onSetErrorText: (newText: string) => void;
  isAdding: boolean;
}

export const AddNewTodoForm: React.FC<Props> = React.memo(({
  user,
  title,
  onSetTitle,
  onTodoAdd,
  onSetErrorText,
  onSetIsError,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const userId = user?.id;

      if (title.trim().length === 0) {
        onSetErrorText("Title can't be empty");
        onSetIsError(true);
      }

      if (!userId || title.trim().length === 0) {
        return;
      }

      onTodoAdd({
        title,
        userId,
        completed: false,
      });

      onSetTitle('');
    }, [title],
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onSetTitle(event.target.value)}
      />
    </form>
  );
});
