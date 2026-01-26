import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
        />
      )}
    </section>
  );
};
