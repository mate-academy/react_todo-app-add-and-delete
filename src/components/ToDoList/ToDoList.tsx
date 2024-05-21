import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { ToDoItem } from '../ToDoItem/ToDoItem';

type Props = {
  visibleToDos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updated: Partial<Todo>) => void;
  tempTodo: Todo | null;
};

export const ToDoList: React.FC<Props> = ({
  visibleToDos,
  onDelete,
  onUpdate,
  tempTodo,
}) => {
  const renderToDos = useMemo(
    () => (tempTodo ? [...visibleToDos, tempTodo] : visibleToDos),
    [visibleToDos, tempTodo],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {renderToDos.map(todo => (
        <ToDoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isTempToDo={todo.id === 0}
        />
      ))}
    </section>
  );
};
