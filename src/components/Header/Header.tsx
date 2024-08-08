import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/todo';
import { USER_ID, addTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (message: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTempTodo,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (title === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    addTodo({ title, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
