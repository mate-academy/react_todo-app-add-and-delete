import { Todo } from '../../types/Todo';
import { TodoListItem } from '../Todo/TodoListItem';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem
          key={todo.id}
          title={todo.title}
          status={todo.completed}
        />
      ))}
    </section>
  );
};
