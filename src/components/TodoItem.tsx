import cn from 'classnames';
import { FC, useState } from 'react';
import { editTodo, removeTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  removeTodoFromTodos: (v: number) => void;
  changeCompletedTodoById: (v: number) => void;
  setErrorMessage:(v: string) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  removeTodoFromTodos,
  changeCompletedTodoById,
  setErrorMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTodoHandler = (todoId: number) => {
    setIsLoading(true);
    setErrorMessage('');

    removeTodo(todoId)
      .then(() => {
        removeTodoFromTodos(todoId);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const changeCompleteHandler = () => {
    setIsLoading(true);
    setErrorMessage('');
    const newTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    editTodo(newTodo)
      .then(() => {
        changeCompletedTodoById(todo.id);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={changeCompleteHandler}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodoHandler(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
