import React from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from '../types/TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: TempTodo | null;
  loadingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  editTodoField: React.RefObject<HTMLInputElement>;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
  onStartEditing: (todo: Todo) => void;
  onRenameTodo: (todo: Todo) => void;
  onEditingTitleChange: (title: string) => void;
  onCancelEditing: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  editingTodoId,
  editingTitle,
  editTodoField,
  onToggleTodo,
  onDeleteTodo,
  onStartEditing,
  onRenameTodo,
  onEditingTitleChange,
  onCancelEditing,
}) => {
  const renderTodo = (todo: Todo | TempTodo) => {
    const isTemp = tempTodo?.id === todo.id;
    const isLoading = isTemp || loadingTodoIds.includes(todo.id);
    const isEditing = editingTodoId === todo.id;

    return (
      <TodoItem
        key={isTemp ? 'temp-todo' : todo.id}
        todo={todo}
        isLoading={isLoading}
        isEditing={isEditing}
        isTemp={isTemp}
        editingTitle={editingTitle}
        editTodoField={editTodoField}
        onToggle={onToggleTodo}
        onDelete={onDeleteTodo}
        onStartEditing={onStartEditing}
        onRename={onRenameTodo}
        onEditingTitleChange={onEditingTitleChange}
        onCancelEditing={onCancelEditing}
      />
    );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(renderTodo)}
      {tempTodo && renderTodo(tempTodo)}
    </section>
  );
};
