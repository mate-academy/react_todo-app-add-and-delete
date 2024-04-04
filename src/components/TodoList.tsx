import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  updateTodo: (updatedTodo: Todo) => void;
  tempTodo: Todo | null;
  loading: boolean;
}

const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  updateTodo,
  tempTodo,
  loading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={updateTodo}
          loading={loading}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          onDeleteTodo={() => {}}
          onUpdateTodo={() => {}}
          loading={loading}
        />
      )}
    </section>
  );
};

export default TodoList;
