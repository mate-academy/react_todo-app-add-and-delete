import React from 'react';
import { TodoItem } from '../todo/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleToggleTodo: (id: number) => void;
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleToggleTodo = () => {},
  onDeleteTodo = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggleTodo={handleToggleTodo}
          handleTodoDelete={onDeleteTodo}
        />
      ))}
    </section>
  );
};
