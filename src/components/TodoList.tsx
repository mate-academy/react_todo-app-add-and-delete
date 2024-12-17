import React from 'react';
import { TodoItem } from '../components/TodoItem';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: FilterType;
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, tempTodo, filter, onDelete }) => {

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const todosToRender = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToRender.map(todo => (
        <TodoItem key={todo.id ? todo.id : 'temp'} todo={todo} onDelete={onDelete} />
      ))}
    </section>
  );
}
