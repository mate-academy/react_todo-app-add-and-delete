import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/filterBy';

type Props = {
  onRemove: (id: number) => void;
  todoList: Todo[];
  filterBy: FilterBy;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = React.memo(({
  todoList,
  filterBy,
  tempTodo,
  onRemove,
}) => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

  // eslint-disable-next-line no-console
  console.log(todoList);

  useEffect(() => {
    switch (filterBy) {
      case FilterBy.Completed:
        setVisibleTodos(todoList.filter(todo => {
          return todo.completed;
        }));
        break;

      case FilterBy.Active:
        setVisibleTodos(todoList.filter(todo => {
          return !todo.completed;
        }));
        break;

      default:
        setVisibleTodos(todoList);
    }
  }, [filterBy, todoList]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
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
              defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => onRemove(todo.id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue="JS"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
});
