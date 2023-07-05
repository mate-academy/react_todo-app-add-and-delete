import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null,
  removeTodo: (todoId: number) => void,
  deletedTodoId: number[],
};

export const Todolist: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  removeTodo,
  deletedTodoId,
}) => (
  <section className="todoapp__main">
    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        removeTodo={removeTodo}
        deletedTodoId={deletedTodoId}
      />
    )}

    {filteredTodos?.map(todo => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        removeTodo={removeTodo}
        deletedTodoId={deletedTodoId}
      />
    ))}

  </section>
);
