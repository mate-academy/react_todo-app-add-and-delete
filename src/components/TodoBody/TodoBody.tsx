import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  filteringBy: Todo[],
  newTodoId: number[],
  tempTodo: Omit<Todo, 'id'> | null,
  deleteTodo: (todoId: number) => void,
  updateTodo: (updatedTodo: Todo) => Promise<void>,
};

export const TodoBody: React.FC<Props> = ({
  filteringBy,
  newTodoId,
  tempTodo,
  deleteTodo,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const editFocus = useRef<HTMLInputElement | null>(null);

  // Activate input OnDoubleclick to edit the todo
  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
  }, [editValue]);

  // Submit the edited todo
  const handleEditingTodo = (
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => {
    event.preventDefault();

    if (editValue === todo.title) {
      return;
    }

    updateTodo({ ...todo, title: editValue })
      .then(() => {
        setIsEditing(null);
        setEditValue('');
      });
  };

  // Reset the edited todo on KeyUp "Escape"
  const resetEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsEditing(null);
      setEditValue('');
    }
  };

  return (
    <section className="todoapp__main">
      {filteringBy.map(todo => (
        <div
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
          onDoubleClick={() => {
            setIsEditing(todo.id);
            setEditValue(todo.title);
          }}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              onChange={() => updateTodo(
                { ...todo, completed: !todo.completed },
              )}
            />
          </label>

          {todo.id === isEditing ? (
            <form onSubmit={(event) => handleEditingTodo(event, todo)}>
              <input
                ref={editFocus}
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editValue}
                onKeyUp={resetEditing}
                onChange={(event) => setEditValue(event.target.value)}
              />
            </form>
          ) : (
            <>
              <span className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div className={classNames(
            'modal overlay',
            { 'is-active': newTodoId.includes(todo.id || 0) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          className="todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
