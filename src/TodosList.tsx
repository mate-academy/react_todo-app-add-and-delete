import TodoItem from './Todo';
import { Todo } from './types/Todo';

interface Props {
  visibleTodos:Todo[],
  handleDeleteTodo: (id: number[]) => void;
}

export const TodosList: React.FC<Props>
= ({ visibleTodos, handleDeleteTodo }) => {
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
};
