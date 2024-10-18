import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodoList: (todos: Todo[]) => void;
  addTodo: (
    tempTodoTitle: string,
    { userId, title, completed }: Omit<Todo, 'id'>,
  ) => Promise<void>;
  loadingState: boolean;
  errorFunction?: (message: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  loadingState,
  setTodoList,
  addTodo,
  errorFunction = () => {},
}) => {
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !loadingState) {
      inputRef.current.focus();
    }
  }, [loadingState]);

  const checkActiveTodos = (): boolean => {
    return todos.every(todo => todo.completed === true);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newValue = event.target.value;

    setQuery(newValue);
    errorFunction('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    errorFunction('');
    const normalizedQuery = query.trim();

    if (normalizedQuery) {
      const result = addTodo(normalizedQuery, {
        userId: USER_ID,
        title: normalizedQuery,
        completed: false,
      });

      if (result instanceof Promise) {
        result
          .then(() => setQuery(''))
          .catch(() => {
            errorFunction('Unable to add a todo');
            setTodoList(todos.filter(todo => todo.id !== 0));
          });
      }
    } else {
      errorFunction('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkActiveTodos(),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          id="createTodoInput"
          ref={inputRef}
          value={query}
          onChange={event => onInputChange(event)}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loadingState}
        />
      </form>
    </header>
  );
};
