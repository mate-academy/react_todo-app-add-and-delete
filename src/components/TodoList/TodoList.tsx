import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodo: Todo[],
  isAdding: boolean,
  todoTitle: string,
  selectedTodo: number,
  deleteTodoFromServer: (value: number) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  visibleTodo,
  isAdding,
  todoTitle,
  selectedTodo,
  deleteTodoFromServer,
}) => {
  const tempTodo = {
    id: 0,
    title: todoTitle,
  };

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {visibleTodo.map(todo => (
        <TodoItem
          selectedTodo={selectedTodo}
          deleteTodoFromServer={deleteTodoFromServer}
          todo={todo}
          key={todo.id}
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
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
});
