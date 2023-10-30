/* eslint-disable no-console */
import { useSelector } from 'react-redux';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { RootState } from '../../redux/store';

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const tempTodo = useSelector((state: RootState) => state.todos.tempTodo);
  const combinedTodos = tempTodo ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {combinedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};

// { status, title, isEditing, isLoading }
// properties of Todos
