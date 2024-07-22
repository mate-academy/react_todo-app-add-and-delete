import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { USER_ID, createTodo } from '../Todos';
import { Todo } from '../Types/TodoType';

type Props = {
  onAdd: (todo: Todo) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  isAllTodosCompleted: boolean;
  fieldTitle: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onAdd,
  setErrorMessage,
  setTempTodo,
  isAllTodosCompleted,
  fieldTitle,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fieldTitle.current?.focus();
  }, [isSubmitting, fieldTitle]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTitle.trim();

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
      createTodo(title)
        .then(newTodo => {
          onAdd(newTodo);
          setNewTitle('');
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

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={fieldTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
