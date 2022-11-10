import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo;
  isAdding: boolean;
  deleteTodo: (todoId: number) => void;
  todosIdsForDelete: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  deleteTodo,
  todosIdsForDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {
      todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          isDeleting={todosIdsForDelete.includes(todo.id)}
        />
      ))
    }

    {isAdding && tempTodo && (
      <TodoInfo
        todo={tempTodo}
        isAdding={isAdding}
      />
    )}
  </section>
);
