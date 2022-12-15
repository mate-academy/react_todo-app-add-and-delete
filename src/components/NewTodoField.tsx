/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useState } from 'react';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

type Props = {
  user: User | null,
  onSetTodo: (newTodo: Todo) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  title: string,
  changeTitle: (value: string) => void,
  onSetTitleError: (isError: boolean) => void,
  onSetIsAdding: (isLoading: boolean) => void,
  isAdding: boolean,
};

export const NewTodoField: React.FC<Props> = (
  {
    user,
    onSetTodo,
    newTodoField,
    title,
    changeTitle,
    onSetTitleError,
    onSetIsAdding,
    isAdding,
  },
) => {
  const [addTodoError, setAddTodoError] = useState(false);

  const addNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSetTitleError(false);
    setAddTodoError(false);

    if (!user) {
      return;
    }

    if (title.trim().length === 0) {
      onSetTitleError(true);
      setTimeout(() => onSetTitleError(false), 3000);

      return;
    }

    try {
      onSetIsAdding(true);
      const newTodo = await createTodo(title, user.id, false);

      onSetTodo(newTodo);
      onSetIsAdding(false);
      changeTitle('');
    } catch {
      setAddTodoError(true);
      onSetIsAdding(false);
      setTimeout(() => {
        setAddTodoError(false);
      }, 3000);
    }
  };

  return (
    <form
      onSubmit={addNewTodo}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => {
          onSetTitleError(false);
          changeTitle(event.target.value);
        }}
        disabled={isAdding}
      />

      {addTodoError && (
        <div
          className={classNames(
            'notification', 'is-danger', 'is-light', {
              hidden: !addTodoError,
            },
          )}
        >
          <span>Unable to add a todo</span>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setAddTodoError(false)}
          />
        </div>
      )}
    </form>
  );
};
