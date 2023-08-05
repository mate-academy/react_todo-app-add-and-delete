import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface List {
  todos: Todo[];
  loaderId: number[],
  removeTodo: (todoId: number) => Promise<unknown>;
  updateTodo: (todoId: number) => Promise<unknown>,
  updateTodoTitle: (todoId: number) => Promise<unknown>,
  switchTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
}

export const TodoList: React.FC<List> = ({
  todos,
  loaderId,
  removeTodo,
  updateTodo,
  updateTodoTitle,
  switchTodoTitle,
  newTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loaderId={loaderId}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          updateTodoTitle={updateTodoTitle}
          switchTodoTitle={switchTodoTitle}
          newTodoTitle={newTodoTitle}
        />
      ))}
    </section>
  );
};
