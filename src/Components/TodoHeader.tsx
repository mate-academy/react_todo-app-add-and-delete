import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { USER_ID } from '../api/todos';
import { MessageError } from '../types/Todo';

type Props = {
  todos: Todo[];
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessege: (messege: string) => void;
  focusInputFn: (fn: () => void) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onSubmit,
  setErrorMessege,
  focusInputFn,
}) => {
  const [titleTodo, setTitleTodo] = useState('');

  const [isSubmiting, setIsSubmiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    focusInputFn(() => {
      inputRef.current?.focus();
    });
  }, [focusInputFn]);

  useEffect(() => {
    if (justAdded) {
      inputRef.current?.focus();
      setJustAdded(false);
    }
  }, [justAdded]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const reset = () => {
    setTitleTodo('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessege('');

    const title = titleTodo.trim();

    if (!title) {
      setErrorMessege(MessageError.title);

      return;
    }

    setIsSubmiting(true);

    onSubmit({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(() => {
        reset();
        setJustAdded(true);
      })
      .catch(() => {
        setErrorMessege(MessageError.add);
        setJustAdded(true);
      })
      .finally(() => {
        setIsSubmiting(false);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        // className="todoapp__toggle-all active"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />
      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit} onReset={reset}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleTodo}
          onChange={handleTitleChange}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
