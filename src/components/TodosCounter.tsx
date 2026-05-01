import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
};

export const TodosCounter = ({ todos }: Props) => {
  return (
    <span className="todo-count" data-cy="TodosCounter">
      {todos.filter(todo => !todo.completed).length} items left
    </span>
  );
};
