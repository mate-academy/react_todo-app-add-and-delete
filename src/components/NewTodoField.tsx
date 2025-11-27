import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  onAdd: (todo: Todo) => void;
  title: string;
  onChange: (value: string) => void;
  onError: (error: string) => void;
  checkResponce: boolean;
};

export const NewTodoField: React.FC<Props> = ({
  todos,
  onAdd,
  title,
  onChange,
  onError,
  checkResponce,
}) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFocus.current?.focus();
  }, [checkResponce]);

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();

    if (!title || title.trim() === '') {
      onError('Title should not be empty');

      return;
    }

    if (title) {
      onAdd({
        userId: USER_ID,
        title: title.trim(),
        completed: false,
        id: 0,
      });
    }
  }

  return (
    <>
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0,
        })}
        data-cy="ToggleAllButton"
      />
      <form>
        <input
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleAddTodo(event);
            }
          }}
          disabled={checkResponce}
          onChange={event => onChange(event.target.value)}
          ref={inputFocus}
        />
      </form>
    </>
  );
};
