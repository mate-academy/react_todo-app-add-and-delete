/* eslint-disable no-console */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  todos: Todo[] | null;
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};

// { status, title, isEditing, isLoading }
// properties of Todos
