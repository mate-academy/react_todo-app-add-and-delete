import { useContext, useEffect, useState } from 'react';

import { addTodo } from '../../api/todos';

import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

import { createTodo } from '../../utils/createTodo';
import { TodoContext } from '../../Context/TodoContext';

export const Header: React.FC = () => {
  const { setTodos, setError, headerInputRef, focusInput, setTempTodo } =
    useContext(TodoContext);
  const [title, setTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleAddTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const validTitle = title.trim();

      if (!validTitle) {
        setError(Error.EmptyTitle);

        return;
      }

      setIsLoaded(true);

      const newTodo = createTodo(validTitle);

      setTempTodo({ ...newTodo, id: 0 });

      addTodo(newTodo)
        .then((todo: Todo) => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, todo]);
          setTitle('');
        })
        .catch(() => {
          setError(Error.AddTodo);
        })
        .finally(() => {
          setIsLoaded(false);

          setTempTodo(null);
        });
    }
  };

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form>
        <input
          ref={headerInputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handleAddTodo}
          disabled={isLoaded}
        />
      </form>
    </header>
  );
};
