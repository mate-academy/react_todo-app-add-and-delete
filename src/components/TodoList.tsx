import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type TodoListProps = {
  todos: Todo[]
  onClick: (todoId: number) => void
  deleteTodoIds: number[]
};

export const TodoList = ({ todos, onClick, deleteTodoIds }: TodoListProps) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onClick={onClick}
        deleteTodoIds={deleteTodoIds}
      />
    ))}
  </section>
);
