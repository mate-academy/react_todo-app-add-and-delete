import { Todo } from '../../types/Todo';
import { TodoModal } from '../TodoModal/TodoModal';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
  deletedTodos: number[];
}

export const TodoList: React.FC<Props> = ({
  todos, deleteTodo, tempTodo, deletedTodos,
}) => (
  <>
    {todos.map((todo) => (
      <TodoModal
        todo={todo}
        key={todo.id}
        isBeingEdited={deletedTodos.includes(todo.id)}
        deleteTodo={deleteTodo}
      />
    ))}
        {tempTodo && (
        <TodoModal
          todo={tempTodo}
          isBeingEdited
          deleteTodo={deleteTodo}
        />
    )}
  </>
);
