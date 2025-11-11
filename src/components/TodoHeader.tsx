import { TodoCreateForm } from './TodoCreateForm';
import cn from 'classnames';

type Props = {
  onToggleAll: () => void;
  allTodosCompleted: boolean;
  onAddTodo: (newTodoTitle: string, resetTitle: () => void) => void;
  onError: (error: string) => void;
  todoTitleInputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onToggleAll,
  allTodosCompleted,
  onAddTodo,
  onError,
  todoTitleInputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allTodosCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
      <TodoCreateForm
        ref={todoTitleInputRef}
        onSubmit={onAddTodo}
        onError={onError}
      />
    </header>
  );
};
