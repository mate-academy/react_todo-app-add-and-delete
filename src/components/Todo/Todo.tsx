import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../utils/todos';
import { Loader } from '../Loader';

type Props = {
  todo: Todo,
  setError: (value: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setError,
  setTodos,
}) => {
  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos((prevTodos: Todo[]) => prevTodos
        .filter(t => t.id !== todoId));
    } catch (error) {
      setError('Unable to delete a todo');
    }
  };

  return (

    <div data-cy="Todo" className={`todo item-enter-done ${todo.completed && 'completed'}`}>
      <Loader
        isActive={false}
      />
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          readOnly
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>
    </div>
  );
};
