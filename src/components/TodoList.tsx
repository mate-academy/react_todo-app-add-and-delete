import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
export type Props = {
  todos: Todo[];
  loadingTodoId?: number[];
  handleToggleTodo: (id: number) => void;
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
};
export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoId,
  handleToggleTodo = () => {},
  onDeleteTodo = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onloadingTodoIds={loadingTodoId}
            handleToggleTodo={handleToggleTodo}
            handleTodoDelete={onDeleteTodo}
          />
        ))}
      </>
    </section>
  );
};
