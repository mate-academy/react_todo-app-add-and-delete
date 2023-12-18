import { FooterNav } from '../FooterNav/FooterNav';
import { useTodoContext } from '../../../Context/Context';

export const TodoFooter = () => {
  const { renderedTodos, multiplyDelite } = useTodoContext();
  const activeTodos = renderedTodos.filter(({ completed }) => !completed);
  const completedTodos = renderedTodos.length - activeTodos.length;
  const todosForDelete = renderedTodos.filter(({ completed }) => completed)
    .map(todo => todo.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>
      <FooterNav />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => multiplyDelite(todosForDelete)}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
