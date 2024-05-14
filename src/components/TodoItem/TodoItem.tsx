import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useState } from 'react';
import { DispatchContext, StateContext } from '../../utils/Store';
import { deleteTodo } from '../../api/todos';

type Props = {
  todoItem: Todo;
};

export const TodoItem = ({ todoItem }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState('');
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  const loading = state.loading.includes(todoItem.id);

  const deleteOneTodo = (todo: Todo) => {
    dispatch({
      type: 'addToLoading',
      payload: { id: todo.id },
    });

    const successDeleteTodo = () => {
      dispatch({
        type: 'deleteTodo',
        payload: { id: todo.id },
      });

      dispatch({
        type: 'removeFromLoading',
        payload: { id: todo.id },
      });
    };

    const unsuccessDeleteTodo = () => {
      dispatch({
        type: 'removeFromLoading',
        payload: { id: todo.id },
      });
      dispatch({
        type: 'setError',
        payload: 'Unable to delete a todo',
      });
    };

    deleteTodo(todo.id).then(successDeleteTodo).catch(unsuccessDeleteTodo);
  };

  const completedTodo = (todo: Todo) => {
    dispatch({
      type: 'completed',
      payload: { id: todo.id },
    });
  };

  const saveChanges = () => {
    if (value.length === 0) {
      dispatch({
        type: 'deleteTodo',
        payload: { id: todoItem.id },
      });
    } else {
      dispatch({
        type: 'editTodo',
        payload: { id: todoItem.id, title: value.trim() },
      });
    }

    setIsEdit(false);
  };

  const handleIsEdit = () => {
    setIsEdit(true);
    setValue(todoItem.title);
  };

  return (
    <>
      {isEdit ? (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            {''}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onBlur={saveChanges}
              onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Escape') {
                  setIsEdit(false);
                } else if (event.key === 'Enter') {
                  saveChanges();
                }
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue(event.target.value);
              }}
            />
          </form>
        </div>
      ) : (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todoItem.completed })}
          key={todoItem.id}
        >
          <label className="todo__status-label">
            {''}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todoItem.completed}
              onChange={() => completedTodo(todoItem)}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleIsEdit}
          >
            {todoItem.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteOneTodo(todoItem)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': loading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
