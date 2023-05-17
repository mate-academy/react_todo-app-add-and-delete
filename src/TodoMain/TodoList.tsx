/* eslint-disable linebreak-style */
import React from 'react';
import classNames from 'classnames';
import { Todo, TodoData } from '../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  visibleTodos: Todo[]
  tempTodo: TodoData | null
  removeTodo: (todoId: number) => void
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
        />
      ))}
      {tempTodo && (
        <div
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
            />
          </label>
          {/* <form>
                    <input
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                    />
                  </form> */}
          <span className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove">×</button>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
