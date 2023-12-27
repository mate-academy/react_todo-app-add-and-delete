import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../../libs/state';
import { Actions, ErrorMessages } from '../../../libs/enums';
import { deleteTodo } from '../../../api/todos';
import { setErrorMessage } from '../../../libs/helpers';

type Props = {
  hasCompleted: boolean;
};

export const RemoveCompleted: React.FC<Props> = ({ hasCompleted }) => {
  const dispatch = useContext(DispatchContext);
  const { todos } = useContext(StateContext);

  const handleDeleteCompleted = () => {
    const comletedIds = todos.reduce((prev, todo) => (
      todo.completed ? [...prev, todo.id] : prev
    ), [] as number[]);

    dispatch({
      type: Actions.setLoader,
      payload: { isLoading: true, todoIds: comletedIds },
    });

    const deletePromises = comletedIds.map(id => (
      deleteTodo(id)
        .then(() => id)
    ));

    Promise.allSettled(deletePromises)
      .then(results => {
        let hasError = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            dispatch({
              type: Actions.delete,
              payload: { todoId: result.value },
            });
          }

          if (result.status === 'rejected') {
            hasError = true;
          }
        });

        if (hasError) {
          setErrorMessage(dispatch, ErrorMessages.FailedToDelete);
        }
      })
      .finally(() => {
        dispatch({ type: Actions.setLoader, payload: { isLoading: false } });
      });
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleDeleteCompleted}
      disabled={!hasCompleted}
    >
      Clear completed
    </button>
  );
};
