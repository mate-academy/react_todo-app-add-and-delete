import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingTodoId: number | null;
  deleteTodo: (todoId: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingTodoId,
  deleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingTodoId={loadingTodoId}
        deleteTodo={deleteTodo}
      />
    ))}
  </section>
);

export default TodoList;
