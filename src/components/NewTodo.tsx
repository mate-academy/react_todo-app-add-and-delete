import classNames from 'classnames';
import React, {
  FormEventHandler,
  RefObject,
  useEffect,
} from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  setTitle: (param: string) => void,
  handleTodos: FormEventHandler<HTMLFormElement>;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  newTodoField,
  title,
  setTitle,
  handleTodos,
}) => {
  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="a problem"
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
          )}
        />
      )}

      <form onSubmit={handleTodos}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={getValue}
        />
      </form>
    </header>
  );
};
