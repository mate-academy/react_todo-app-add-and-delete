import { useContext } from 'react';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { TodosContext } from '../TodosContext';

export const Footer: React.FC = () => {
  const { todos, clearCompletedTodos } = useContext(TodosContext);

  const completedTodos = todos.filter(todo => todo.completed);

  const notCompletedTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos.length === 1
          ? '1 item left'
          : `${notCompletedTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <TodosFilter />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!(completedTodos.length)}
      >
        Clear completed
      </button>
    </footer>
  );
};
