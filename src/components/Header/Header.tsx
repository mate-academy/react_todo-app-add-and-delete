import cn from 'classnames';
import { useTodos } from '../../context/TodosContext';
import { TodosForm } from '../TodosForm';

export const Header: React.FC = () => {
  const { todos, toggleAllTodo } = useTodos();

  const isAllTodosActive = todos.some(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        onClick={toggleAllTodo}
        aria-label="toggle all active todos"
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosActive })}
        data-cy="ToggleAllButton"
      />

      <TodosForm />
    </header>
  );
};
