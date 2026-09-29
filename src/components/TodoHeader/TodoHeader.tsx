import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

function createTodo(title: string): Omit<Todo, 'id'> {
  return {
    userId: client.USER_ID,
    title: title,
    completed: false,
  };
}

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  setTodos: Dispatch<SetStateAction<Todo[] | undefined>>;
  setError: Dispatch<SetStateAction<string>>;
  setTempTodo: Dispatch<SetStateAction<Omit<Todo, 'id'> | null>>;
  isFormDisabled: boolean;
  setIsFormDisabled: Dispatch<SetStateAction<boolean>>;
  deletingTodoIds: number[];
};

export const TodoHeader = ({
  query,
  setQuery,
  setTodos,
  setError,
  setTempTodo,
  isFormDisabled,
  setIsFormDisabled,
  deletingTodoIds,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFormDisabled) {
      inputRef.current?.focus();
    }
  }, [isFormDisabled, deletingTodoIds]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();

          if (query.trim() !== '') {
            setTempTodo(createTodo(query.trim()));
            setIsFormDisabled(true);

            client
              .addTodo(createTodo(query.trim()))
              .then(newTodo => {
                setTodos(previousTodos =>
                  previousTodos ? [...previousTodos, newTodo] : [newTodo],
                );
                setTempTodo(null);
                setIsFormDisabled(false);
                setQuery('');
              })
              .catch(() => {
                setError('Unable to add a todo');
                setTempTodo(null);
                setIsFormDisabled(false);
              });
          } else {
            setError('Title should not be empty');
          }
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          autoFocus={true}
          disabled={isFormDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
