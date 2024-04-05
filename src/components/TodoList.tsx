import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  updateTodo: (updatedTodo: Todo) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
}

const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  updateTodo,
  tempTodo,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDeleteTodo={() => {}}
          onUpdateTodo={() => {}}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};

export default TodoList;
