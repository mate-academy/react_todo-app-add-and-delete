import { useState } from 'react';
import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../api/todos';

type Props = {
  onAddTodo: (newTodo: Todo) => void;
  onAddTemporaryTodo: (tempoTodo: Todo | null) => void;
  onError: (error: ErrorMessage | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header = ({
  onAddTodo,
  onAddTemporaryTodo,
  onError,
  inputRef,
}: Props) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const addTodo = async () => {
      try {
        if (!newTodoTitle.trim()) {
          throw new Error(ErrorMessage.EMPTY_TITLE);
        }

        const tempTodo: Todo = {
          title: newTodoTitle.trim(),
          userId: USER_ID,
          completed: false,
        };

        const newTodo: Todo = {
          title: newTodoTitle.trim(),
          userId: USER_ID,
          completed: false,
        };

        onAddTemporaryTodo(tempTodo);

        const response = await postTodo(newTodo);

        if (!response) {
          throw new Error(ErrorMessage.ADD_TODO);
        }

        onAddTodo(response);

        setNewTodoTitle('');
        setIsSubmitting(false);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'Title should not be empty'
        ) {
          onError(ErrorMessage.EMPTY_TITLE);
        } else {
          onError(ErrorMessage.ADD_TODO);
        }
      } finally {
        setIsSubmitting(false);
        onAddTemporaryTodo(null);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);

        setTimeout(() => {
          onError(null);
        }, 3000);
      }
    };

    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          autoFocus
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
