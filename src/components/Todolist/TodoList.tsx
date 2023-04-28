import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  setError,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        setTodos={setTodos}
        setError={setError}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        isLoading
        setTodos={setTodos}
        setError={setError}
      />
    )}
  </section>
);
