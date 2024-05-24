/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';

export const TodoList: React.FC = () => {
  const {
    readyTodos,
    handleCompletedStatus,
    editingTitleField,
    handleDelete,
    tempTodo,
    isDeletion,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {readyTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleCompletedStatus(todo)}
            />
          </label>
          {false && (
            <form>
              <input
                data-cy="TodoTitleField"
                ref={editingTitleField}
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue={todo.title}
                // onChange={event => {
                //   setEditedTitle(event.target.value.trim());
                //   setWasEdited(true);
                // }}
                // onKeyDown={event => {
                //   if (event.key === 'Enter') {
                //     handleSubmit(event);
                //   } else if (event.key === 'Escape') {
                //     setEditedTitle(selectedTodo.title);
                //     setSelectedTodo(null);
                //   }
                // }}
                // onBlur={event => {
                //   handleSubmit(event);
                // }}
              />
            </form>
          )}
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo)}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames('modal', {
                'is-active': isDeletion,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        </div>
      ))}

      {tempTodo && (
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

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
