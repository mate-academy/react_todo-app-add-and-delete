import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoError } from '../types/TodoError';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (todoId: number) => void,
  setErrorMessage: (newError: TodoError) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  setErrorMessage,
}) => (
  <ul className="todo-list">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        setErrorMessage={setErrorMessage}
      />
    ))}

    {tempTodo && (
      <li
        className={classNames('todo', {
          completed: tempTodo.completed,
        })}
      >
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">
          {tempTodo.title}
        </span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </li>
    )}
  </ul>
);
