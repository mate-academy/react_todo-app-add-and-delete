import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  todosByDeleting: number[],
  temporaryTodo: Todo | null,
  handleDeleteTodo: (id: number) => void,
};

export const Todolist: React.FC<Props> = ({
  todos,
  todosByDeleting,
  temporaryTodo,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          todosByDeleting={todosByDeleting}
        />
      ))}

      {temporaryTodo && (
        <TodoInfo
          todo={temporaryTodo}
          handleDeleteTodo={handleDeleteTodo}
          todosByDeleting={todosByDeleting}
        />
      )}
    </section>
  );
};
