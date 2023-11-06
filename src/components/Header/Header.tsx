/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Error';

interface Props {
  setTodos: (value: Todo[]) => void
  todos: Todo[]
  setError: (value: string) => void,
  setTempTodo: (value: Todo | null) => void,
  temptodo: Todo | null
}

export const Header: React.FC<Props> = ({
  setTodos,
  todos,
  setError,
  setTempTodo,
  temptodo,
}) => {
  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [temptodo]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Errors.title);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 11843,
      title: title.trim(),
      completed: false,
    });

    addTodos({
      userId: 11843,
      title: title.trim(),
      completed: false,
    }).then((todo) => {
      setTodos([...todos, todo]);
      setTitle('');
    })
      .catch(() => setError(Errors.unableAdd))
      .finally(() => {
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={temptodo !== null}
          value={title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
