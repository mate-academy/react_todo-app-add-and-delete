import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../constants';
import { addTodoToServer } from '../api/todos';
import { TodoError } from '../types/TodoError';

type Props = {
  addTodo: (newTodo: Todo) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  setErrorMessage: (newError: TodoError) => void;
};

export const TodoForm: React.FC<Props> = ({
  addTodo,
  setTempTodo,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage(TodoError.EmptyTitle);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsDisabled(true);
    setTempTodo(tempTodo);

    addTodoToServer(tempTodo)
      .then(todoFromServer => addTodo(todoFromServer))
      .then(() => setTitle(''))
      .catch(() => setErrorMessage(TodoError.Add))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  );
};
