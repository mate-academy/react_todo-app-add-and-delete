import { Action } from '../State/State';
import { deleteTodo } from '../api/todos';

export function handleDeleteTodo(
  setIsLoading: (v: boolean) => void,
  dispatch: (value: Action) => void,
  id: number,
) {
  setIsLoading(true);

  deleteTodo(`/todos/${id}`)
    .then(() => dispatch({ type: 'deleteTodo', payload: id }))
    .catch(() => {
      dispatch(
        { type: 'setError', payload: 'Unable to delete a todo' },
      );
    })
    .finally(() => {
      setIsLoading(false);
    });
}
