import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
          />
        );
      })}

      {tempTodo
        && <TodoItem todo={tempTodo} />}
    </section>
  );
};
