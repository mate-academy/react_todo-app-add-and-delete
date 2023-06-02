import { TodoData } from '../types/TodoData';
import { Todo } from './Todo';

interface TodoListProps {
  todos: TodoData[];
  onTodoDelete: (todoId: number) => Promise<void>;
}

export const TodoList = ({ onTodoDelete, todos }: TodoListProps) => {
  return (
    <>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          isTempTodo={false}
          onTodoDelete={onTodoDelete}
        />
      ))}
    </>

  );
};
