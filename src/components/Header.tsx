import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { createTodo } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const { setErrorMessage, setTodos, setTempTodo } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCatch = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const tempTodo: Todo = {
      title: query.trim(),
      completed: false,
      id: 0,
      userId: USER_ID,
    };

    if (query.trim().length === 0) {
      setErrorMessage(ErrorMessage.emptyTitle);
      inputRef.current?.focus();
      handleCatch();

      return;
    }

    setTempTodo(tempTodo);

    inputRef.current?.setAttribute('disabled', 'true');

    createTodo(tempTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
        // setTempTodo(tempTodo);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.failedAddTodo);
      })
      .finally(() => {
        handleCatch();
        inputRef.current?.removeAttribute('disabled');
        inputRef.current?.focus();
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          name="newTodoName"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
