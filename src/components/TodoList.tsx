import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoContext } from '../contexts/TodoContext';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
}) => {
  const {
    setTodos,
    isLoading,
    setError,
    isDeleting,
    setIsDeleting,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todos={todos}
          todo={todo}
          isLoading={isLoading}
          setTodos={setTodos}
          setError={setError}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todos={todos}
          todo={tempTodo}
          isLoading
          setTodos={setTodos}
          setError={setError}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      )}
    </section>
  );
};
