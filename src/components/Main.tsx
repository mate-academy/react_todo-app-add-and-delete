import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (id: number) => Promise<number>,
  selTodo: Todo | null,
};

export const Main:React.FC<Props> = ({
  todos,
  onDeleteTodo,
  selTodo,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => {
        return (
          <TodoItem todo={todo} onDeleteTodo={onDeleteTodo} />
        );
      })}
      {selTodo && <TodoItem todo={selTodo} onDeleteTodo={onDeleteTodo} />}
    </section>
  );
};
