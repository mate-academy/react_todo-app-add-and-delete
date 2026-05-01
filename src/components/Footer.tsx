import { Todo } from '../types/Todo';
import { TodosCounter } from './TodosCounter';
import { Filter } from './Filter';
import { FilterValues } from '../types/FilterValuesEnum';

type Props = {
  todos: Todo[];
  todoStatus: FilterValues;
  setTodoStatus: (value: FilterValues) => void;
  clearCompletedTodo: () => void;
};

export const Footer = ({
  todos,
  todoStatus,
  setTodoStatus,
  clearCompletedTodo,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodosCounter todos={todos} />

      <Filter todoStatus={todoStatus} setTodoStatus={setTodoStatus} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={clearCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
