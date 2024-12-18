import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  deleteDisabled: number[];
  tempTodo: Todo | null;
  deleteCompleted: () => Promise<void>;
  clearDisabled: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos: todosData,
  deleteTodo,
  deleteDisabled,
  tempTodo,
  deleteCompleted,
  clearDisabled,
}) => {
  const [todos, setTodos] = useState<Todo[]>(todosData);
  const [filterBy, setFilterBy] = useState<string>('all');

  useEffect(() => {
    if (filterBy === 'all') {
      setTodos(todosData);
    } else if (filterBy === 'active') {
      setTodos(todosData.filter(todo => !todo.completed));
    } else if (filterBy === 'completed') {
      setTodos(todosData.filter(todo => todo.completed));
    }
  }, [filterBy, todosData]);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              {''}
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              onClick={() => deleteTodo(todo.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled={deleteDisabled.includes(todo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': deleteDisabled.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
        {tempTodo && (
          <div key={tempTodo.id} data-cy="Todo" className="todo">
            <label className="todo__status-label">
              {''}
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button
              onClick={() => deleteTodo(tempTodo.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled={deleteDisabled.includes(tempTodo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
        {/* This is a completed todo */}
        {/* <div data-cy="Todo" className="todo completed">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        Completed Todo
      </span>

      {/* Remove button appears only on hover */}
        {/* <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button> */}

        {/* overlay will cover the todo while it is being deleted or updated */}
        {/* <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */}

        {/* This todo is an active todo */}
        {/* <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        Not Completed Todo
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */}

        {/* This todo is being edited */}
        {/* <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div> */}

        {/* This todo is in loadind state */}
      </section>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todosData.filter(todo => !todo.completed).length} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', { selected: filterBy === 'all' })}
            data-cy="FilterLinkAll"
            onClick={() => setFilterBy('all')}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', { selected: filterBy === 'active' })}
            data-cy="FilterLinkActive"
            onClick={() => setFilterBy('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filterBy === 'completed',
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilterBy('completed')}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={clearDisabled}
          onClick={deleteCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
