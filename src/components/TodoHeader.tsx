import React from 'react';
import { Todo } from '../types/Todo';
import { TodoButtons } from './TodoButtons';
import { NewTodo } from './NewTodo';

interface TodoHeaderProps {
  todos: Todo[];
  focusedInput: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  onToggleAll: () => void;
  onAddTodo: (title: string) => Promise<void>;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  focusedInput,
  isAdding,
  onToggleAll,
  onAddTodo,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <TodoButtons todos={todos} onToggleAll={onToggleAll} />
      )}
      <NewTodo
        focusedInput={focusedInput}
        onAddTodo={onAddTodo}
        disabled={isAdding}
      />
    </header>
  );
};
