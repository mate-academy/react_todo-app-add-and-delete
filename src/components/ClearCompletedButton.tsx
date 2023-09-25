import { deleteTodo } from '../api';
import { useError, useTodos } from '../providers';
import { Action } from '../types';
import { ERRORS } from '../utils';

type Props = {
  active: boolean;
  onClear: (loading: boolean) => void;
};

export const ClearCompletedButton: React.FC<Props> = ({ active, onClear }) => {
  const { todos, dispatch } = useTodos();
  const { setError } = useError();

  const handleClick = () => {
    onClear(true);

    const completedTodos = todos.filter(({ completed }) => completed);

    const deleteRequests = completedTodos.map(({ id }) => {
      return deleteTodo(id)
        .then(() => id)
        .catch((reason) => {
          throw new Error(reason);
        });
    });

    Promise.all(deleteRequests)
      .then(ids => {
        dispatch({
          type: Action.ClearCompleted,
          payload: ids,
        });
      })
      .catch(() => {
        setError(ERRORS.DELETE_TODO);
      })
      .finally(() => {
        onClear(false);
      });
  };

  return (
    <button
      type="button"
      data-cy="ClearCompletedButton"
      className="todoapp__clear-completed"
      disabled={!active}
      onClick={handleClick}
    >
      Clear completed
    </button>
  );
};
