/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Todo } from '../Todo/Todo';

export const TodoMain: React.FC = memo(() => {
  const { state } = useContext(AppContext);
  const { filteredTodos, tempTodo } = state;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <Todo todo={todo} key={todo.id} />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            x
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});

TodoMain.displayName = 'TodoMain';
