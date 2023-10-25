import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        title={todo.title}
        completed={todo.completed}
        id={todo.id}
      />
    ))}
  </section>
);
