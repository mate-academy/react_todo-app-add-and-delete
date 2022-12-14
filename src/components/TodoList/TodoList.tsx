import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  loader: boolean;
  focusedTodoId: number;
  onDeleteTodo: (value: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  loader,
  focusedTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          focusedTodoId={focusedTodoId}
          loader={loader}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </section>
  );
};
