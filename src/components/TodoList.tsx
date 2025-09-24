import { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  filteredTodos: Todo[];
  onTodoComplete: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onSubmitChangeTodo: (updatedTodo: Todo) => Promise<Todo>;
  deletingId: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onTodoComplete,
  onDeleteTodo,
  onSubmitChangeTodo,
  deletingId,
  tempTodo,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedTodoQuery, setSelectedTodoQuery] = useState('');
  const inputEditRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setSelectedTodoQuery(todo.title);

    setTimeout(() => {
      inputEditRef.current?.focus();
    }, 0);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo =>
        todo.id !== selectedTodo?.id ? (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            key={todo.id}
          >
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  onTodoComplete(todo);
                }}
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(todo)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': deletingId.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ) : (
          <div data-cy="Todo" className="todo" key={todo.id}>
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <form
              onSubmit={event => {
                event.preventDefault();
                onSubmitChangeTodo({
                  ...selectedTodo,
                  title: selectedTodoQuery,
                }).finally(() => setSelectedTodo(null));
              }}
            >
              <input
                ref={inputEditRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={selectedTodoQuery}
                onChange={event => setSelectedTodoQuery(event.target.value)}
                onBlur={() => setSelectedTodo(null)}
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ),
      )}
      {tempTodo !== null && (
        <div data-cy="Todo" className="todo" key={tempTodo.id}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={false}
              disabled
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" disabled>
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
