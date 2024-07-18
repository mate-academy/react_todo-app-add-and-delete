/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StatesContext } from '../context/Store';
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';
import { deleteTodo, updateTodo } from '../api/todos';

export const TodoList: React.FC = () => {
  const { todos, selectedTodo, filter } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const filteredTodos = todos.filter(t => {
    switch (filter) {
      case 'all':
        return t;
      case 'active':
        return !t.completed;
      case 'completed':
        return t.completed;
      default:
        return t;
    }
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [isEditing]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { ['completed']: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={e => {
                  dispatch({ type: 'startUpdate' });
                  dispatch({
                    type: 'updateTodo',
                    payload: { ...todo, completed: e.target.checked },
                  });
                  updateTodo(todo.id, {
                    ...todo,
                    completed: e.target.checked,
                  })
                    .catch(() => {
                      dispatch({
                        type: 'showError',
                        payload: 'Unable to update a todo',
                      });
                    })
                    .finally(() => {
                      dispatch({ type: 'stopUpdate' });
                    });
                }}
              />
            </label>

            {isEditing && selectedTodo === todo.id ? (
              <form>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={todo.title}
                  ref={inputRef}
                  onBlur={() => setIsEditing(false)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setIsEditing(true);
                    dispatch({ type: 'selectTodo', payload: todo.id });
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    dispatch({ type: 'startUpdate' });
                    dispatch({ type: 'deleteTodo', payload: todo.id });
                    deleteTodo(todo.id)
                      .catch(() => {
                        dispatch({
                          type: 'showError',
                          payload: 'Unable to delete a todo',
                        });
                      })
                      .finally(() => dispatch({ type: 'stopUpdate' }));
                  }}
                >
                  ×
                </button>
              </>
            )}
            <TodoLoader />
          </div>
        );
      })}
    </section>
  );
};
