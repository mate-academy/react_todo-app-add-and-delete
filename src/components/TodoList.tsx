import React, { useContext } from 'react';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { TodoComponent } from './TodoComponent';

interface Props {
  todos: Todo[],
  deletingTodo: number,
  deletingTodos: number[],
  onRemoveTodo: (todoId: number) => Promise<void>,
  isAdding: boolean,
  todoTitle: string,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  deletingTodo,
  deletingTodos,
  onRemoveTodo,
  isAdding,
  todoTitle,
}) => {
  const user = useContext(AuthContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoComponent
          todo={todo}
          key={todo.id}
          onRemoveTodo={onRemoveTodo}
          deletingTodo={deletingTodo}
          deletingTodos={deletingTodos}
        />
      ))}
      {isAdding && (
        <TodoComponent
          todo={{
            id: 0,
            userId: user?.id || 0,
            title: todoTitle,
            completed: false,
          }}
          onRemoveTodo={onRemoveTodo}
          deletingTodo={deletingTodo}
          deletingTodos={deletingTodos}
        />
      )}
    </section>
  );
});
