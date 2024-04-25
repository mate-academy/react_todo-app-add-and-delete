import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, handleDeleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
