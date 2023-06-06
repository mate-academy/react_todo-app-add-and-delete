import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  onDeleteTodo(id: number): void,
  isUpdating: number[],
  tempTodo: Todo | null,
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  onDeleteTodo,
  isUpdating,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isUpdating={isUpdating}
        />
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>
          <div className={classNames('modal overlay',
            { 'is-active': tempTodo !== null })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
