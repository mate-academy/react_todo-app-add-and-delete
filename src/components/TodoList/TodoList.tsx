import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  completedTodos: Todo[];
  addCompletedTodo: (todoId: number) => void;
  removeCompletedTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    deleteTodo,
    completedTodos,
    addCompletedTodo,
    removeCompletedTodo,
  } = props;

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={deleteTodo}
          completedTodos={completedTodos}
          addTodo={addCompletedTodo}
          removeTodo={removeCompletedTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={deleteTodo}
          completedTodos={completedTodos}
          addTodo={addCompletedTodo}
          removeTodo={removeCompletedTodo}
        />
      )}
    </section>
  );
};
