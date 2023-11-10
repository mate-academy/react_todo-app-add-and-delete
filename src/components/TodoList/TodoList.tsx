import cn from 'classnames';
import {
  useContext, useState, useRef, useEffect,
} from 'react';
import { TodosContext } from '../TodosProvider';
import { Todo } from '../../types/Todo';

export const TodoList: React.FC = () => {
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState('');

  const {
    filteredTodos,
    deleteTodoHandler,
    tempTodo,
    processingTodoIds,
    isEditing,
  } = useContext(TodosContext);

  const focusTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTodo.current) {
      focusTodo.current.focus();
    }
  });

  const handleDoubleClick = (
    event:
    | React.MouseEvent<HTMLSpanElement>
    | React.KeyboardEvent<HTMLSpanElement>,
    todo: Todo,
  ) => {
    switch (event.detail) {
      case 2: {
        setEditTodo(todo);
        setNewTodo(todo.title);
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape' && editTodo?.id) {
      setEditTodo(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo) => (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': processingTodoIds.find((el) => el === todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

          {todo === editTodo ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
                ref={focusTodo}
                onKeyDown={handleKeyDown}
                disabled={isEditing}
              />
            </form>
          ) : (
            <>
              <span
                role="button"
                data-cy="TodoTitle"
                className="todo__title"
                onClick={(event) => handleDoubleClick(event, todo)}
                onKeyDown={(event) => handleDoubleClick(event, todo)}
                tabIndex={0}
              >
                {todo.title}
              </span>
              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodoHandler(todo.id)}
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}
      {tempTodo && (
        <>
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': tempTodo,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      )}
    </section>
  );
};
