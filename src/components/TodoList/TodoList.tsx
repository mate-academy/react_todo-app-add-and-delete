import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  todoList: Todo[];
  filterBy: FilterBy;
  tempTodo: Todo | null;
  onRemove: (id: number) => void;
  isDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  filterBy,
  tempTodo,
  onRemove,
  isDeleting,
}) => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [toDeleteId, setToDeleteId] = useState(0);

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
  }, [filterBy, todoList, isDeleting]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              onRemove(todo.id);
              setToDeleteId(todo.id);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              {
                'is-active': isDeleting && todo.id === toDeleteId,
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
