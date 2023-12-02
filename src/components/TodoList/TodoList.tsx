import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todo: Todo) => void;
  isLoader: number | null;
}

export const TodoList: React.FC<Props> = ({ todos, removeTodo, isLoader }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          isTempTodo={false}
          isLoader={isLoader}
        />
      ))}
    </section>
  );
};
