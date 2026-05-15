import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { postTodo, USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  title: string;
  isLoading?: boolean;
  isDeleting: boolean;
  setTempTodo: (t: Todo | null) => void;
  setTitle: (t: string) => void;
  setTodos: (t: Todo[]) => void;
  setErrorMessage: (m: string) => void;
  setIsLoading: (l: boolean) => void;
  onToggleAll: (todos: Todo[]) => void;
};

export const NewTodoList: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  isDeleting,
  setTodos,
  setErrorMessage,
  setIsLoading,
  setTempTodo,
  onToggleAll,
}) => {
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isPosting, isDeleting]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setTitle(event.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    setIsLoading(true);
    setIsPosting(true);
    const trimedTitle = title.trim();

    if (!trimedTitle) {
      setErrorMessage('Title should not be empty');
      setIsLoading(false);
      setIsPosting(false);

      return;
    }

    const tempTodo: Todo = {
      title: trimedTitle,
      completed: false,
      userId: USER_ID,
      id: 0,
    };

    setTempTodo(tempTodo);

    postTodo(tempTodo)
      .then(createdTodo => {
        setTodos([...todos, createdTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsPosting(false);
        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={() => onToggleAll(todos)}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          disabled={isPosting}
        />
      </form>
    </header>
  );
};
