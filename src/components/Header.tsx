import { Todo } from '../types/Todo';
import { HeaderForm } from './HeaderForm';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  isTogglingAll: boolean;
  isLoading: boolean;
  onAddTodo: (title: string) => Promise<boolean>;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => Promise<void>;
};

export const Header: React.FC<Props> = ({
  todos,
  isAdding,
  isTogglingAll,
  isLoading,
  onAddTodo,
  newTodoInputRef,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          disabled={isLoading || isTogglingAll}
          onClick={onToggleAll}
        />
      )}

      <HeaderForm
        onAddTodo={onAddTodo}
        newTodoInputRef={newTodoInputRef}
        isAdding={isAdding}
      />
    </header>
  );
};
