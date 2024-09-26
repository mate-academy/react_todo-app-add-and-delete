/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { ClientTodo } from '../../types';
import { todosApi } from '../../api/todos';
import { TodosDispatchContext } from '../../contexts/TodosContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { FormInputContext } from '../../contexts/FormInputContext';

type Props = {
  todo: ClientTodo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const todosDispatch = useContext(TodosDispatchContext);
  const { setError } = useContext(ErrorContext);
  const { focus: focusFormInput, setDisabled: setDisabledFormInput } =
    useContext(FormInputContext);

  const isBeingEdited = false;

  const handleDelete = async () => {
    todosDispatch({ type: 'setLoad', payload: { id: todo.id, loading: true } });
    setDisabledFormInput(true);
    setError({ message: '' });

    try {
      await todosApi.delete(todo.id);
      todosDispatch({ type: 'delete', payload: todo.id });
    } catch (error) {
      setError({ message: 'Unable to delete a todo' });
    } finally {
      todosDispatch({
        type: 'setLoad',
        payload: { id: todo.id, loading: false },
      });

      setDisabledFormInput(false);
      focusFormInput();
    }
  };

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
        />
      </label>

      {isBeingEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            onClick={handleDelete}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todo.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
