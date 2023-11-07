import {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { addTodos } from '../api/todos';

interface Props {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (value: Todo | null) => void,
  setErrorMessage: (value: Errors) => void,
}
export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const inputTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputTitleRef.current) {
      inputTitleRef.current.focus();
    }
  }, [tempTodo]);

  const trimTitle = title.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!trimTitle) {
      setErrorMessage(Errors.EmptyTitle);
    }

    setTempTodo({
      id: 0,
      userId: 11844,
      title: trimTitle,
      completed: false,
    });

    addTodos({
      userId: 11844,
      title: trimTitle,
      completed: false,
    }).then((todo) => {
      setTodos([...todos, todo]);
      setTitle('');
    })
      .catch(() => setErrorMessage(Errors.UnableAdd))
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          disabled={tempTodo !== null}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputTitleRef}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
