import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todos: Todo[]
  handleRemove : (todoId: number) => void
  isAdding: boolean
};

export const TodoList:React.FC<Props> = ({ todos, handleRemove, isAdding }) => {
  return (

    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleRemove(todo.id)}
          >
            ×
          </button>
          {isAdding && (
            <Loader />
          )}
        </div>
      ))}

    </section>
  );
};
