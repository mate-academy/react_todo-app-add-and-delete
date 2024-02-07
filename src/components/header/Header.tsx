import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { addTodos } from '../../api/todos';
import { TodoContext } from '../../Context/TodoContext';
import { Errors } from '../../types/Errors';

export const Header = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    setErrorType,
    setHasError,
  } = useContext(TodoContext);
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);
  // const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // const userId = 54
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (!title.trim()) {
      setHasError(true);
      setErrorType(Errors.EmptyTitle);
    } else {
      const newTodo = {
        userId: 54,
        title: title.trim(),
        completed: false,
      };
      const loadTodo = {
        id: 0,
        userId: 54,
        title,
        completed: false,
      };

      setTempTodo(loadTodo);
      setDisabled(true);

      addTodos(newTodo)
        .then(prevTodos => {
          setTodos(currentTodos => [...currentTodos, prevTodos]);
          setTitle('');
        })
        .catch(() => {
          setErrorType(Errors.Add);
          setHasError(true);
        })
        .finally(() => {
          setTempTodo(null);
          setDisabled(false);
        });
    }
  }

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Save"
      />
      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={disabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
