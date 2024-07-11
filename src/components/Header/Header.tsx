import { TodoForm } from '../TodoForm/TodoForm';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';

type Props = {
  handleError: (message: string) => void;
};

export const Header: React.FC<Props> = ({ handleError }) => {
  const { todos } = useGlobalState();
  const dispatch = useDispatch();

  const allChecked = todos.every(todo => todo.completed);

  const toggleAllChecked = () => {
    dispatch({ type: Type.ToggleAllChecked });
  };

  return (
    <header className="todoapp__header">
      {todos.length >= 1 && (
        <button
          type="button"
          className={'todoapp__toggle-all ' + (allChecked ? 'active' : '')}
          data-cy="ToggleAllButton"
          onClick={toggleAllChecked}
        />
      )}
      <TodoForm handleError={handleError} />
    </header>
  );
};
