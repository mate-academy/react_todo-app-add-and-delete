/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { postTodos } from '../../api/todos';
import { TodoContext } from '../State/TodoContext';

export const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const {
    setTodos,
    todos,
    setErrorText,
    setIsError,
    setIsFocused,
    isFocused,
    isError,
    setTempToDo,
  } = useContext(TodoContext);

  const allTodosToggle = todos.every(todo => todo.completed);
  const USER_ID = 136;
  const trimmedQuery = query.trim();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, isError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (trimmedQuery === '') {
      setIsError(true);
      setErrorText('Title should not be empty');

      return;
    }

    const tempTodo = {
      id: 0,
      title: trimmedQuery,
      completed: false,
      userId: USER_ID,
    };

    setTempToDo(tempTodo);

    setIsFocused(true);

    postTodos({ userId: USER_ID, completed: false, title: trimmedQuery })
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setQuery('');
        setIsError(false);
        setTempToDo(null);
      })
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to add a todo');
      })
      .finally(() => {
        setIsFocused(false);
        setTempToDo(null);
      });
  };

  const handleToggleAll = () => {
    setTodos(prevTodos => prevTodos.map(todo => (
      { ...todo, completed: !allTodosToggle }
    )));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodosToggle })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isFocused}
        />
      </form>
    </header>
  );
};
