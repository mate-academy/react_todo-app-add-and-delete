import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoIdem';

type Props = {
  filteredTodos: Todo[];
  loadingIds: number[];
  toggleTodoCompleted: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  loadingIds,
  toggleTodoCompleted,
  deleteTodo,
  updateTodoTitle,
  inputRef,
  tempTodo,
}) => {
  const [editingId, setEditingId] = useState<number>();
  const [editInput, setEditInput] = useState('');

  const editor = (todo: Todo) => {
    setEditingId(todo.id);
    setEditInput(todo.title);
  };

  const handleEditInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInput(e.target.value);
  };

  const handleSave = useCallback(() => {
    if (editingId !== undefined) {
      const trimmed = editInput.trim();

      if (trimmed) {
        updateTodoTitle(editingId, trimmed);
      }

      setEditingId(undefined);
      setEditInput('');
    }
  }, [editInput, editingId, updateTodoTitle]);

  useEffect(() => {
    if (editingId !== undefined && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId, inputRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingId !== undefined &&
        inputRef.current &&
        event.target instanceof HTMLElement &&
        !inputRef.current.contains(event.target)
      ) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId, editInput, handleSave, inputRef]);

  //todoItem should have loader on everything
  //editor work wrong, it shouldnt change todo.comleted
  //едітор не бачить пробіли чомусь
  //look at the tests and pass them
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          toggleTodoCompleted={toggleTodoCompleted}
          deleteTodo={deleteTodo}
          handleSave={handleSave}
          handleEditInput={handleEditInput}
          editor={editor}
          editInput={editInput}
          editingId={editingId}
          inputRef={inputRef}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={true}
          toggleTodoCompleted={() => {}}
          deleteTodo={() => {}}
          handleSave={() => {}}
          handleEditInput={() => {}}
          editor={() => {}}
          editInput={''}
          editingId={undefined}
          inputRef={inputRef}
        />
      )}
    </section>
  );
};
