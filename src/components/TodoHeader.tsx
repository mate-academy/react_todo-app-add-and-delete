import classNames from 'classnames';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  isEveryActive: boolean;
  errorMessage: string;
  createTodo: (
    event: FormEvent,
    todoText: string,
    setTodoText: (value: string) => void,
  ) => void;
  isLoading: boolean;
  todos: Todo[];
};

export const TodoHeader: React.FC<Props> = ({
  isEveryActive,
  createTodo,
  isLoading,
  todos,
  errorMessage,
}) => {
  const [todoText, setTodoText] = useState('');
  const submitInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (submitInput.current) {
      submitInput.current.focus();
    }
  }, [todos, errorMessage]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          isEveryActive === true && 'active',
        )}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => createTodo(event, todoText, setTodoText)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoText}
          ref={submitInput}
          disabled={isLoading}
          onChange={event => setTodoText(event.target.value)}
        />
      </form>
    </header>
  );
};
