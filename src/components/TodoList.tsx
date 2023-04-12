import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoTask } from './TodoTask';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  tempTodo: Todo;
  deleteTodo: (todoId: number) => void
}

export const TodoList: FC<Props> = ({
  todos,
  isAdding,
  tempTodo,
  deleteTodo,
}) => {
  return (
    <>
      {todos.map((todo) => (
        <TodoTask
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
        />
      ))}
      {isAdding && (
        <TodoTask
          todo={tempTodo}
          deleteTodo={deleteTodo}
        />
      )}
    </>
  );
};
