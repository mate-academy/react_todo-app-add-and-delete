import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../hooks/useTodosContext';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useTodosContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
