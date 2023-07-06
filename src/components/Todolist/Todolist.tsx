import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  filteredTodos: Todo | null; // tempTodo
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;
};

export const Todolist: React.FC<Props> = ({
  todos,
  filteredTodos,
  loadingTodos,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoInfo
          todo={todo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          key={todo.id}
        />
      ))}
      {filteredTodos && (
        <TodoInfo
          todo={filteredTodos}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
        />
      )}
    </section>
  );
};
