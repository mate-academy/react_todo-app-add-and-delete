import { useEffect, useRef, useState } from 'react';
import { CurrentError } from '../../types/CurrentError';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onAddNewTodo: (todoTitle: string) => Promise<boolean>
  onSetErrorMessage: (error: CurrentError) => void
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAddNewTodo,
  onSetErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, isDisabled]);

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onSetErrorMessage(CurrentError.EmptyTitleError);

      return;
    }

    try {
      setIsDisabled(true);

      const isSuccess = await onAddNewTodo(title.trim());

      if (isSuccess) {
        setTitle('');
      }

      setIsDisabled(false);
      titleField.current?.focus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <header className="todoapp__header">
      {!!activeTodosCount && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={titleField}
          disabled={isDisabled}
          onChange={(event) => setTitle(event.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
