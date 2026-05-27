import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';

type Props = {
  filteredTodos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  toggleTodo,
  deleteTodo,
  loadingTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
        />
      ))}

      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
