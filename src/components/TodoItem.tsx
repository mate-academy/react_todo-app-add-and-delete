import { useContext, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { updateTodos } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { EditTodoForm } from './EditTodoForm';

interface Props {
  todo: Todo,
  isTempTodo?: boolean,
}

export const TodoItem: React.FC<Props> = ({ todo, isTempTodo }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    setErrorMessage,
    updateTodoList,
    idsToUpdate,
    idsToChange,
    deleteTodoById,
  } = useContext(TodoContext);

  const handleDeleteTodo = (todoId: number) => {
    idsToUpdate(todoId);

    deleteTodoById(todoId);
  };

  const handleUpdateStatus = (todoToStatusUpdate: Omit<Todo, 'userId'>) => {
    const { completed, id } = todoToStatusUpdate;

    idsToUpdate(id);

    updateTodos({ ...todoToStatusUpdate, completed: !completed })
      .then(() => {
        updateTodoList({ ...todoToStatusUpdate, completed: !completed });
      })
      .catch(() => setErrorMessage(ErrorMessage.FailedUpdateTodo))
      .finally(() => idsToUpdate(null));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onDoubleClick={() => setIsEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleUpdateStatus(todo)}
          checked={todo.completed}
        />
      </label>

      {
        isEditMode
          ? (
            <EditTodoForm
              todoOnUpdate={todo}
              onEditMode={setIsEditMode}
            />
          )
          : (
            <>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )
      }

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': idsToChange.includes(todo.id) || isTempTodo,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
