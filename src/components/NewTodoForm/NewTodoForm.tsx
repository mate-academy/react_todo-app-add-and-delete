import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  todosCount: number;
};

export const NewTodoForm: React.FC<Props> = ({ onSubmit, todosCount }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todosCount]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoField.current) {
      newTodoField.current.disabled = true;
    }

    onSubmit({
      id: 0,
      title: todoTitle.trim(),
      userId: USER_ID,
      completed: false,
    })
      .then(() => {
        setTodoTitle('');
      })
      .catch(() => {})
      .finally(() => {
        if (newTodoField.current) {
          newTodoField.current.disabled = false;
          newTodoField.current.focus();
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={newTodoField}
        value={todoTitle}
        onChange={event => setTodoTitle(event.target.value)}
      />
    </form>
  );
};
