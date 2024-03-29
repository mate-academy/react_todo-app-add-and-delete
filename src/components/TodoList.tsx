import classNames from 'classnames';
import React, { useContext } from 'react';
import { DispatchContext, StateContext } from './MainContext';
import { Todo } from '../types/Todo';
import { Select } from '../types/Select';
import { deleteTodo } from '../api/todos';
import { ActionTypes } from '../types/ActionTypes';
import { TodoLoader } from './TodoLoader';

interface Props {
  tempTodo: Todo | null;
}

const getPreparedTodos = (todoList: Todo[], selectedTodo: string) => {
  switch (selectedTodo) {
    case Select.ACTIVE:
      return todoList.filter(todo => !todo.completed);
    case Select.COMPLETED:
      return todoList.filter(todo => todo.completed);

    default:
      return todoList;
  }
};

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const dispatch = useContext(DispatchContext);
  const { todos, selectPage } = useContext(StateContext);

  const visibleTodos = getPreparedTodos(todos, selectPage);

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id)
      .then(() => {
        dispatch({
          type: ActionTypes.DeleteTodo,
          payload: id,
        });
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.SetValuesByKeys,
          payload: {
            errorMessage: 'Unable to delete a todo',
          },
        });
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </div>
        );
      })}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
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

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <TodoLoader />
        </div>
      )}
    </section>
  );
};
