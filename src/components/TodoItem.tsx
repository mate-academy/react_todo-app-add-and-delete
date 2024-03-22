/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, editTodos } from '../api/todos';
import { SetTodosContext } from './TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  // const [isEditing, setIsEditind] = useState(false);

  const setTodos = useContext(SetTodosContext);

  const handleTodoCheck = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    editTodos(updatedTodo).then(() => {
      setTodos(prevTodos => {
        return prevTodos.map(prevTodo => {
          if (prevTodo.id === todo.id) {
            return updatedTodo;
          }

          return prevTodo;
        });
      });
    });
  };

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      deleteTodos(todoId);

      setTodos(prevTodos => {
        return prevTodos.filter(prevTodo => prevTodo.id !== todoId);
      });
    },
    [setTodos],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoCheck}
        />
      </label>

      <>
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleTodoDelete(todo.id)}
        >
          ×
        </button>
      </>

      {/* {isEditing && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )} */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {/* <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */}
    </div>
  );
};
