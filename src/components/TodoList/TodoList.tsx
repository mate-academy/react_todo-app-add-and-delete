import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/filterBy';

type Props = {
  todoList: Todo[];
  filterBy: FilterBy;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todoList, filterBy }) => {
    const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

    // eslint-disable-next-line no-console
    console.log('rerender');

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
    }, [filterBy]);

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
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

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
  }
);
