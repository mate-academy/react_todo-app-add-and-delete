import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (id: number) => void,
  removedTodoId: number | null
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  removedTodoId,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        removeTodo={removeTodo}
        removedTodoId={removedTodoId}
      />
    ))}
    {tempTodo && (
      <div className="todo">
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">{tempTodo.title}</span>
        <button type="button" className="todo__remove">×</button>

        <div className="overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
