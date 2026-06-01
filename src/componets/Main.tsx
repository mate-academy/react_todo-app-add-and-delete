import React from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;

  handleChangeComplete: (todoId: number) => void;

  editingTodoId: number | null;
  handleEditSubmit: (todoId: number) => void;

  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;

  handleDobelChangeTitle: (todoId: number, title: string) => void;

  removeElement: (todoId: number) => void;

  loadingTodoId: number[];
};
export const Main: React.FC<Props> = ({
  visibleTodos,
  handleChangeComplete,
  editingTodoId,
  handleEditSubmit,
  editTitle,
  setEditTitle,
  handleDobelChangeTitle,
  removeElement,
  loadingTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoId={loadingTodoId}
          handleChangeComplete={handleChangeComplete}
          editingTodoId={editingTodoId}
          handleEditSubmit={handleEditSubmit}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handleDobelChangeTitle={handleDobelChangeTitle}
          removeElement={removeElement}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTemp={true}
          loadingTodoId={loadingTodoId}
          handleChangeComplete={handleChangeComplete}
          editingTodoId={editingTodoId}
          handleEditSubmit={handleEditSubmit}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handleDobelChangeTitle={handleDobelChangeTitle}
          removeElement={removeElement}
        />
      )}
    </section>
  );
};
