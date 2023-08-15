import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { TodosContext } from '../../TodosContext';
import { Error } from '../../types/Error';
import { USER_ID } from '../../utils/userId';

export const TodosHeader: React.FC = () => {
  const {
    setError,
    addTodo,
    setTempTodo,
    tempTodo,
    todos,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocus) {
      todoInput.current?.focus();
    }

    setIsFocus(false);
  }, [isFocus]);

  const isTempTodo = useMemo(() => {
    return tempTodo !== null;
  }, [tempTodo]);

  const isActiveTodos = todos.some(todo => !todo.completed);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();

    if (!query.trim()) {
      setError(Error.Title);
      setQuery('');

      return;
    }

    const newData = {
      id: 0,
      title: query,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newData);

    addTodo(newData)
      .then(() => {
        setQuery('');
      })
      .finally(() => {
        setTempTodo(null);
        setIsFocus(true);
      });
  };

  return (
    <header className="todoapp__header">
      {isActiveTodos && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="mark all todos"
        />
      )}

      <form>
        <input
          ref={todoInput}
          disabled={isTempTodo}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyPressEnter}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
