import React from 'react';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';
import { Todo } from '../../types/Todo';

interface TodoListProps {
  todos: Todo[];
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  saveTodo: (id: number, title: string) => void;
  deleteTodo: (id: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  editingTodoId,
  setEditingTodoId,
  editingTitle,
  setEditingTitle,
  saveTodo,
  deleteTodo,
  loadingTodoIds,
  tempTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        editingTodoId={editingTodoId}
        setEditingTodoId={setEditingTodoId}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        saveTodo={saveTodo}
        deleteTodo={deleteTodo}
        loadingTodoIds={loadingTodoIds}
      />
    ))}

    {tempTodo && <TempTodo todo={tempTodo} />}
  </section>
);
