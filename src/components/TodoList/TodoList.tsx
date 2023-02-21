import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null,
  tempTodos: Todo[],
  removeTodo:(id: number) => void,
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  tempTodos,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoading={tempTodos.some(t => t.id === todo.id)}
          key={todo.id}
          removeTodo={removeTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          key={tempTodo.id}
          removeTodo={removeTodo}
        />
      )}

    </section>
  );
};
