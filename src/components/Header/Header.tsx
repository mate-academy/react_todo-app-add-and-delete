import { useState, useRef, useEffect } from 'react';
import { addTodos, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type HeaderProps = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorMessage: (error: string) => void;
  setTemporaryTodo: (todo: Todo | null) => void;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTemporaryTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    const newTodo = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTemporaryTodo({ id: 0, ...newTodo });

    addTodos(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTemporaryTodo(null);
        setIsSubmitting(false);
        inputRef.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
