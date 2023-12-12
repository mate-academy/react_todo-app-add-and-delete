import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoContext';
import { Loading } from '../Loading';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { deleteTodo, isLoading } = useContext(TodoContext);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {(isLoading === todo.id) && <Loading />}

      {/* /!* This form is shown instead of the title and remove button *!/ */}
      {/* <form> */}
      {/*  <input */}
      {/*    data-cy="TodoTitleField" */}
      {/*    type="text" */}
      {/*    className="todo__title-field" */}
      {/*    placeholder="Empty todo will be deleted" */}
      {/*    value="Todo is being edited now" */}
      {/*  /> */}
      {/* </form> */}
    </div>
  );
};
