import cn from 'classnames';
import { Tabs } from '../../types/Helpers';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

interface Props {
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  selectedTab: Tabs;
  setFilteredTodos: (value: React.SetStateAction<Todo[]>) => void;
  setSelectedTab: (value: React.SetStateAction<Tabs>) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (value: React.SetStateAction<string>) => void;
  setIsErrorShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  selectedTab,
  setFilteredTodos,
  setSelectedTab,
  setIsLoading,
  setError,
  setIsErrorShown,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const thereAreCompleted = todos.some(todo => todo.completed);

  const handleTabs = (tab: Tabs) => {
    switch (tab) {
      case Tabs.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        setSelectedTab(Tabs.Active);
        break;
      case Tabs.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        setSelectedTab(Tabs.Completed);
        break;
      default:
        setFilteredTodos(todos);
        setSelectedTab(Tabs.All);
    }
  };

  const handleRemoveCompleted = () => {
    async function removeCompleted() {
      const completedIds = todos.filter(t => t.completed).map(t => t.id);

      setIsLoading(completedIds);
      try {
        const deletePromises = completedIds.map(deleteTodo);

        await Promise.all(deletePromises);
        setTodos(todos.filter(t => !t.completed));
      } catch {
        setError('Unable to delete a todo');
        setIsErrorShown(true);
      } finally {
        setIsLoading([]);
      }
    }

    removeCompleted();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft === 1
          ? `${todosLeft} item left `
          : `${todosLeft} items left `}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedTab === Tabs.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleTabs(Tabs.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedTab === Tabs.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleTabs(Tabs.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedTab === Tabs.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleTabs(Tabs.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      {thereAreCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleRemoveCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
