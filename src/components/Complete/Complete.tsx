/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
};

export const Complete: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMesage,
}) => {
  const handleComplete = async (item: Todo) => {
    const updatedTodo = { ...item, completed: !todo.completed };

    try {
      const updatedResponse: Todo = await updateTodos(todo.id, updatedTodo);

      setTodos(prev =>
        prev.map(el => (el.id === updatedResponse.id ? updatedResponse : el)),
      );
    } catch {
      setErrorMesage('Unable to update todo');
    }
  };

  return (
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        onChange={() => handleComplete(todo)}
        checked={todo.completed}
      />
    </label>
  );
};
