import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../context/todo.context';
import { TodoListFilterStatus } from '../types/Todo';

const TodoListFilterPanel:React.FC = () => {
  const {
    todoListFilterStatus,
    handleTodoListFilterStatus,
    todosStatistics,
    removeCompletedTodos,
  } = useContext(TodoContext);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosStatistics.activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: todoListFilterStatus === TodoListFilterStatus.All,
          })}
          onClick={() => handleTodoListFilterStatus(TodoListFilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: todoListFilterStatus === TodoListFilterStatus.Active,
          })}
          onClick={
            () => handleTodoListFilterStatus(TodoListFilterStatus.Active)
          }
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: todoListFilterStatus === TodoListFilterStatus.Completed,
          })}
          onClick={
            () => handleTodoListFilterStatus(TodoListFilterStatus.Completed)
          }
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {
        todosStatistics.completedTodos > 0 && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={removeCompletedTodos}
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};

export default TodoListFilterPanel;
