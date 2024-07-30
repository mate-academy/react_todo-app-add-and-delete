import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, postTodos } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (todo: Todo) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const TodoHeader: React.FC<Props> = ({
  onAdd,
  setErrorMessage,
  setTempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldTitle = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      setErrorMessage('Title should not be empty');
    } else {
      setIsSubmitting(true);
      const todo = {
        title,
        userId: USER_ID,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);
      postTodos(title)
        .then(newTodo => {
          onAdd(newTodo);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);
        });
    }
  };

  useEffect(() => {
    fieldTitle.current?.focus();
  }, [isSubmitting]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={fieldTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={element => setTitle(element.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
