import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  filter: Filter;
  temporaryTodo: Todo | null;
  handleDelete: (todo:Todo) => void;
};

const filterTodos = (todos: Todo[], filter: Filter) => {
  let filteredTodos = todos;

  switch (filter) {
    case 'Active':
      filteredTodos = filteredTodos.filter(todo => todo.completed === false);
      break;
    case 'Completed':
      filteredTodos = filteredTodos.filter(todo => todo.completed === true);
      break;
    case 'All':
    default:
  }

  return filteredTodos;
};

export const TodoList = ({
  todos, filter, temporaryTodo, handleDelete,
} : Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(todos, filter).map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {temporaryTodo && <TempTodo temporaryTodo={temporaryTodo} />}
    </section>
  );
};
