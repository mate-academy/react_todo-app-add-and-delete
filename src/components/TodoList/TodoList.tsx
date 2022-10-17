import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  setError: (error: string) => void,
  setDeleted: (prev: any) => void,
  todos: Todo[],
  isDeletingAll: boolean,
};

export const TodoList: React.FC<Props> = ({
  setError,
  setDeleted,
  todos,
  isDeletingAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            setError={setError}
            setDeleted={setDeleted}
            isDeletingAll={isDeletingAll}
          />
        );
      })}
    </section>
  );
};

// TODO:
// TODOS WITH SOME EXTRA FEACHERS WE NEED TO CREATE IN THE FEATURE:
/*
<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

  <span data-cy="TodoTitle" className="todo__title">CSS</span>

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

<div data-cy="Todo" className="todo">
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
</div>

<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

  <span data-cy="TodoTitle" className="todo__title">React</span>
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

<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

  <span data-cy="TodoTitle" className="todo__title">Redux</span>
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
 */
