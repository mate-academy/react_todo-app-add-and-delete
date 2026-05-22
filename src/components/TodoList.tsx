import { Todo } from '../types/Todo';
import { TodoCard } from './Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  processingIds: number[];
};

export const TodoList = ({ todos, onDelete, processingIds }: Props) => {
  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isProcessed={processingIds.includes(todo.id)}
        />
      ))}
    </>
  );
};
