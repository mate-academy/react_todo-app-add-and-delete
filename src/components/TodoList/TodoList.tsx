import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Error } from '../../types/Error';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  setError: (v: Error) => void,
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo, setError }) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        setError={setError}
      />
    ))}
    {tempTodo && (
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={false}
          />
        </label>
        <span className="todo__title">{tempTodo.title}</span>
        <button type="button" className="todo__remove">×1</button>
        <div className="overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
