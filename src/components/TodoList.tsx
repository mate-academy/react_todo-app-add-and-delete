// components/TodoList.tsx
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
  selectedTodoId: number | null;
  setSelectedTodoId: (id: number | null) => void;
  titleToSet: string;
  setTitleToSet: (title: string) => void;
  loading: number[];
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onUpdate: (id: number, checked?: boolean, title?: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filteredTodos,
  selectedTodoId,
  setSelectedTodoId,
  titleToSet,
  setTitleToSet,
  loading,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          titleToSet={titleToSet}
          setTitleToSet={setTitleToSet}
          loading={loading}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
