import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteTodo: (value: number) => void;
  updateTodo: (value: number, value2: Partial<Todo>) => void;
  updatingTodos: number[];
  tempTodo : Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updatingTodos,
  tempTodo,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isLoading={updatingTodos.includes(todo.id)}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
        />
      )}
    </section>
  );
};
