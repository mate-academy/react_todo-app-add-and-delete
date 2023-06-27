import { TodoInfo } from './TodoInfo';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodosId: number[] | [];
  handleDeletedTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletedTodosId,
  handleDeletedTodo,
}) => (
  <ul className="todoapp__main">
    {todos.map(todo => (
      <li key={todo.id}>
        <TodoInfo
          todo={todo}
          deletedTodosId={deletedTodosId}
          handleDeletedTodo={handleDeletedTodo}
        />
      </li>
    ))}

    {!!tempTodo && (
      <TodoInfo
        todo={tempTodo}
        deletedTodosId={deletedTodosId}
        handleDeletedTodo={handleDeletedTodo}
      />
    )}
  </ul>
);
