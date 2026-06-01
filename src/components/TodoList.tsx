import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import { FilterType } from './Filter';

interface TodoListProps {
  todos: TodoType[];
  filter: FilterType;
  tempTodo?: TodoType | null;
  processingIds: number[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,
  processingIds,
  onDelete,
}) => {
  const getFilteredTodos = () => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isProcessed={processingIds.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
      {tempTodo && <Todo key="temp" todo={tempTodo} isProcessed />}
    </section>
  );
};
