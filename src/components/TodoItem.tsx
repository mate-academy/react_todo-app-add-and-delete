import { useState } from 'react';
import cn from 'classnames';
import { TContext, useTodoContext } from './TodoContext';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';

type Props = {
  todo: Todo,
  // key: number,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const {
    // todos,
    setTodos,
    handleError,
    tempTodos,
    // idTemp,
  } = useTodoContext() as TContext;

  const USER_ID = 11550;

  const handleDelete = (todoId: number) => {
    setIsDeleting(true);

    return deleteTodo(todoId)
      .then(() => getTodos(USER_ID))
      .then((res) => {
        setTodos(res);
        setIsDeleting(false);
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  };

  // const handleCompleted(todoId: number) => {

  //   return patchTodo(todoId)
  //     .then(() => getTodos(USER_ID))
  //     .then((res) => {
  //       setTodos(res);
  //     })
  //     .catch(() => {
  //       handleError('Unable to update a todo');
  //     });
  // }

  return (
    <div data-cy="Todo" className={`${todo?.completed ? 'todo completed' : 'todo'}`} key={todo?.id}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          // onClick={handleCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo?.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo?.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': (isDeleting === true) || (todo.id === 0) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
