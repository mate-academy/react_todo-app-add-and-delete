import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { TodoData } from '../TodoData';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  isAdding: boolean;
  tempTodo: Todo;
  deletingTodosId: number[];
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    handleDeleteTodo,
    isAdding,
    tempTodo,
    deletingTodosId,
  }) => (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoData
            todo={todo}
            key={todo.id}
            handleDeleteTodo={() => handleDeleteTodo(todo.id)}
            deletingTodosId={deletingTodosId}
          />
        );
      })}
      {isAdding && (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: tempTodo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteTodo(tempTodo.id)}
          >
            ×
          </button>
          <Loader />
        </div>
      )}
    </section>
  ),
);
