import { Dispatch, SetStateAction, useContext } from 'react';
import { Filter } from '../Filter/Filter';
import { DispatchContext, StateContext } from '../../store/Store';
import { deleteTodo } from '../../api/todos';

type Props = {
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
};
export const Footer: React.FC<Props> = ({ setIsDeleting }) => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const getUnCompletedTodos = todos.filter(todo => !todo.completed);
  const getCompletedTodos = todos.filter(todo => todo.completed);
  const handleDeletionTodos = async () => {
    await Promise.all(
      getCompletedTodos.map(async todo => {
        setIsDeleting(true);
        await deleteTodo(todo.id)
          .then(() => {
            dispatch({ type: 'REMOVE_LOCAL_TODO', payload: { id: todo.id } });
          })
          .catch(() => {
            dispatch({
              type: 'SHOW_ERROR_MESSAGE',
              payload: { message: 'Unable to delete a todo' },
            });
          });
      }),
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getUnCompletedTodos.length} items left
      </span>
      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeletionTodos}
        disabled={Boolean(!getCompletedTodos.length)}
      >
        Clear completed
      </button>
    </footer>
  );
};
