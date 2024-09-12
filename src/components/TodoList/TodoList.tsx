import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  independentTodo: Todo | null;
  handleError: (el: Errors) => void;
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  independentTodo,
  todos,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem todo={todo} key={todo.id} handleError={handleError} />
      ))}

      {independentTodo && (
        <TodoItem
          todo={independentTodo}
          key={independentTodo.id}
          handleError={handleError}
        />
      )}
    </section>
  );
};
