import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[]
  onDeleteTodo: (todoId: number) => void;
}

export const TodoList: FC<TodoListProps> = ({ todos, onDeleteTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={() => onDeleteTodo(todo.id)}
        />
      ))}
    </section>
  );
};
