import { Todo } from '../types/TodoItem';
import TodoItem from './Todo';

interface Props {
  visibleTodos: Todo[];
  handleDeleteTodo: (id: number[]) => void;
}

export default function TodosList({ visibleTodos, handleDeleteTodo }: Props) {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          isTemp={false}
          handleDeleteTodo={handleDeleteTodo}
          key={todo.id}
        />
      ))}
    </>
  );
}
