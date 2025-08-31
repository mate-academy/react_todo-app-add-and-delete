import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todos: Todo[];
  inputRef: { current: null | HTMLInputElement };
  setError: (error: string) => void;
  onAdd: (title: string) => Promise<boolean>;
  error: string | null;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  inputRef,
  setError,
  onAdd,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTitle.trim().length === 0) {
      setError('Title should not be empty');

      return;
    }

    onAdd(newTitle.trim()).then(response => {
      if (response) {
        setNewTitle('');
      }

      inputRef.current?.focus();
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={SubmitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
