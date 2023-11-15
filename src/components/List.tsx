import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (value: number) => void;
  tempTodo: Todo | null;
};

export const List: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        handleDeleteTodo={handleDeleteTodo}
        todo={todo}
        key={todo.id}
      />
    ))}

    {tempTodo && (
      <TodoItem
        handleDeleteTodo={handleDeleteTodo}
        todo={tempTodo}
        key={tempTodo.id}
      />
    )}
  </section>
);

// {/* This todo is not completed */}
// <div data-cy="Todo" className="todo">
// <label className="todo__status-label">
//   <input
//     data-cy="TodoStatus"
//     type="checkbox"
//     className="todo__status"
//   />
// </label>

// <span data-cy="TodoTitle" className="todo__title">
//   Not Completed Todo
// </span>
// <button type="button" className="todo__remove" data-cy="TodoDelete">
//   ×
// </button>

// <div data-cy="TodoLoader" className="modal overlay">
//   <div className="modal-background has-background-white-ter" />
//   <div className="loader" />
// </div>
// </div>

// {/* This todo is being edited */}
// <div data-cy="Todo" className="todo">
// <label className="todo__status-label">
//   <input
//     data-cy="TodoStatus"
//     type="checkbox"
//     className="todo__status"
//   />
// </label>

// {/* This form is shown instead of the title and remove button */}
// <form>
//   <input
//     data-cy="TodoTitleField"
//     type="text"
//     className="todo__title-field"
//     placeholder="Empty todo will be deleted"
//     value="Todo is being edited now"
//   />
// </form>

// <div data-cy="TodoLoader" className="modal overlay">
//   <div className="modal-background has-background-white-ter" />
//   <div className="loader" />
// </div>
// </div>

// {/* This todo is in loadind state */}
// <div data-cy="Todo" className="todo">
// <label className="todo__status-label">
//   <input
//     data-cy="TodoStatus"
//     type="checkbox"
//     className="todo__status"
//   />
// </label>

// <span data-cy="TodoTitle" className="todo__title">
//   Todo is being saved now
// </span>

// <button type="button" className="todo__remove" data-cy="TodoDelete">
//   ×
// </button>

// {/* 'is-active' class puts this modal on top of the todo */}
// <div data-cy="TodoLoader" className="modal overlay is-active">
//   <div className="modal-background has-background-white-ter" />
//   <div className="loader" />
// </div>
// </div>
