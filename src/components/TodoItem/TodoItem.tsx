import { useContext } from 'react';
import { deleteTodos } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../../utils/GlobalStateProvider';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  handleError: (el: Errors) => void;
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

export const TodoItem: React.FC<Props> = ({ todo, handleError }) => {
  const dispatch = useContext(DispatchContext);
  const { todos, deletingList } = useContext(StateContext);
  const { title, completed } = todo;

  const handleDelete = () => {
    handleError(Errors.reset);

    dispatch({ type: 'setDeletingList', payload: [todo.id] });

    let isError = false;

    deleteTodos(todo.id)
      .catch(error => {
        if (error) {
          isError = true;
        }

        handleError(Errors.deletingError);
        throw error;
      })
      .finally(() => {
        if (!isError) {
          dispatch({
            type: 'setTodos',
            payload: todos.filter(prevTodo => todo.id !== prevTodo.id),
          });
        }

        dispatch({ type: 'setDeletingList', payload: [] });
      });
  };

  return (
    <div data-cy="Todo" className={'todo' + (completed ? ' completed' : '')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>
      <Loader deletingList={deletingList} todoId={todo.id} />
    </div>
  );
};
