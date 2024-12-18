import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  selectedTodo: number | null;
  clearCompleted: boolean;
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  selectedTodo,
  clearCompleted,
  tempTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={deleteTodo}
          selectedTodo={selectedTodo}
          clearCompleted={clearCompleted}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          selectedTodo={tempTodo.id}
          handleDeleteTodo={deleteTodo}
          clearCompleted={true}
        />
      )}
    </section>
  );
};
