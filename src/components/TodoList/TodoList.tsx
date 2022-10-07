import { FC } from 'react';
import { TodoItem } from '../TodoItem';

import { Props } from './TodoList.props';

export const TodoList: FC<Props> = ({
  todos,
  onRemoveTodo,
  onUpdate,
  isTodoLoaded,
  query,
  setSelectedTodos,
  selectedTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdate={onUpdate}
          selectedTodos={selectedTodos}
          setSelectedTodos={setSelectedTodos}
        />
      ))}

      {/* Loader */}
      {isTodoLoaded && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {query}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
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
