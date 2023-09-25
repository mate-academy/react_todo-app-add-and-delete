/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { countTodos } from '../../utils/counterTodos';

type Props = {
  isDisable: boolean,
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (title: string) => void,
  todos: Todo[]
};

export const TodoHeader: React.FC<Props> = ({
  isDisable,
  onHandleSubmit,
  title,
  setTitle,
  todos,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todos.length, isDisable]);

  return (
    <header className="todoapp__header">
      {countTodos(todos, false) && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          disabled={isDisable}
        />
      )}

      <form onSubmit={onHandleSubmit}>
        <input
          disabled={isDisable}
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
