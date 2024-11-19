import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export interface FooterProps {
  todos: Todo[];
  isFooterActive: boolean;
  setEditingTodosId: (ids: number[]) => void;
  loadAllTodos: () => void;
  setError: (error: string) => void;
  editingTodosId: number[];
  setFilteredTodos: (todos: Todo[]) => void;
  setTodos: (todos: Todo[]) => void;
  filter: string;
  setFilter: (filter: string) => void;
}
export function Footer({
  todos,
  isFooterActive,
  setEditingTodosId,
  setError,
  editingTodosId,
  setTodos,
  setFilteredTodos,
  filter,
  setFilter,
}: FooterProps) {
  function handleFilterTodos(filterString: string) {
    setFilter(filterString);
    switch (filterString) {
      case 'all':
        setFilteredTodos(todos);
        break;
      case 'active':
        setFilteredTodos(todos.filter(t => !t.completed));
        break;
      case 'completed':
        setFilteredTodos(todos.filter(t => t.completed));
        break;
      default:
        setFilteredTodos(todos);
    }
  }

  async function handleDeleteAllCompletedTodos() {
    const completedTodos = todos.filter(t => t.completed);
    const completedTodoIds = completedTodos.map(t => t.id);

    setEditingTodosId([...editingTodosId, ...completedTodoIds]);

    const successfulDeletes: number[] = [];

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        successfulDeletes.push(todo.id);
      } catch (error) {
        setError('Unable to delete a todo');
      }
    }

    const newTodos = todos.filter(t => !successfulDeletes.includes(t.id));

    setEditingTodosId(
      editingTodosId.filter(id => !completedTodoIds.includes(id)),
    );
    setFilteredTodos(newTodos);
    setTodos(newTodos);
  }

  return (
    <>
      {isFooterActive && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todos.filter(t => !t.completed).length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              onClick={() => handleFilterTodos('all')}
              href="#/"
              className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
            >
              All
            </a>

            <a
              onClick={() => handleFilterTodos('active')}
              href="#/active"
              className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              onClick={() => {
                handleFilterTodos('completed');
              }}
              href="#/completed"
              className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={`todoapp__clear-completed`}
            data-cy="ClearCompletedButton"
            disabled={!todos.some(t => t.completed)}
            onClick={handleDeleteAllCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
}
