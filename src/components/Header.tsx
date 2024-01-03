import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  todo: Todo | null,
  title: string,
  userId: number,
  onSetTitle: (t: string) => void,
  onTitleError: (t: string) => void,
  onSelectTodo: (t: Todo | null) => void,
  onAddTodo: (t: Todo) => Promise<void>,
};

export const Header:React.FC<Props> = ({
  todos,
  title,
  userId,
  onSetTitle,
  onTitleError,
  onSelectTodo,
  onAddTodo,
}) => {
  const [disabledField, setDisabledField] = useState(false);

  const reset = () => {
    onSetTitle('');
    onTitleError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      onTitleError('Title should not be empty');
      setTimeout(() => {
        onTitleError('');
      }, 3000);
    } else {
      const id = 0;
      const trimTitle = title.trim();
      const notComplete = false;

      const newTodo = {
        id,
        userId,
        title: trimTitle,
        completed: notComplete,
      };

      onSelectTodo(newTodo);

      setDisabledField(true);
      onAddTodo(newTodo)
        .then(reset)
        .finally(() => {
          setDisabledField(false);
          onSelectTodo(null);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length && (
        // eslint-disable-next-line
        <button
          type="button"
          className={todos.length
            ? 'todoapp__toggle-all active'
            : 'todoapp__toggle-all'}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={(input) => input && input.focus()}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            onSetTitle(e.target.value);
          }}
          disabled={disabledField}
        />
      </form>
    </header>
  );
};
