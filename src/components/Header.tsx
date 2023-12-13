/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GlobalContex } from '../TodoContext';
import { Todo } from '../types/Todo';
import { TodoErrors } from '../types/TodoErrors';

export const Header: React.FC = () => {
  const {
    USER_ID,
    postNewTodo,
    todos,
    setTodos,
    setError,
    setTempTodo,
    isLoading,
    setIsLoading,
  } = useContext(GlobalContex);

  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const titleValue = event.target.value;

    setTitle(titleValue);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsLoading(true);

      const tempTodo: Omit<Todo, 'userId'> = {
        id: 0,
        title: title.trim(),
        completed: false,
      };

      setTempTodo(tempTodo);

      const newTodo: Omit<Todo, 'id'> = {
        title: title.trim(),
        userId: USER_ID,
        completed: false,
      };

      postNewTodo(newTodo)
        .then(todo => {
          setTitle('');
          setTodos([...todos, todo]);
          inputRef.current?.focus();
        })
        .catch(() => setError(TodoErrors.Add))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    } else {
      setError(TodoErrors.Title);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          value={title}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
