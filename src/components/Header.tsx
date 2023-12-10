import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoContext, USER_ID } from '../TodoContext';
import { addTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

export const Header: React.FC = () => {
  const {
    todos,
    inputRef,
    setTempTodo,
    setVisibleTodos,
    setTodos,
    setError,
    tempTodo,
  } = useContext(TodoContext);

  const [inputValue, setInputValue] = useState('');

  const hasActiveTodos = todos.some(todo => !todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputRef]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim()) {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: inputValue.trim(),
        completed: false,
      };

      setTempTodo(newTodo);

      addTodo(newTodo)
        .then((todo) => {
          setTodos([...todos, todo]);
          setVisibleTodos([...todos, todo]);
          setInputValue('');
        })
        .catch(() => setError(ErrorMessage.AddTodo))
        .finally(() => {
          setTempTodo(null);
        });
    } else {
      setError(ErrorMessage.TitleEmpty);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: hasActiveTodos },
        )}
        data-cy="ToggleAllButton"
        aria-label="ToggleAll"
      />

      <form onSubmit={handleSubmit}>
        <input
          disabled={tempTodo !== null}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
