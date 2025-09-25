import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { Filter } from '../../utils/Filter';

type Props = {
  visibleTodos: Todo[];
  isTodoEditing: boolean;
  selectedPostId: number;
  setIsTodoEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  selectedFilter: Filter;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  isTodoEditing,
  selectedPostId,
  setIsTodoEditing,
  setSelectedPostId,
  selectedFilter,
  onDelete,
  onUpdate,
}) => {
  let todosCopy: Todo[];

  switch (selectedFilter) {
    case Filter.all:
      todosCopy = [...visibleTodos];
      break;

    case Filter.active:
      todosCopy = [...visibleTodos].filter(todo => !todo.completed);
      break;

    case Filter.completed:
      todosCopy = [...visibleTodos].filter(todo => todo.completed);
      break;

    default:
      todosCopy = [...visibleTodos];
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosCopy.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isTodoEditing={isTodoEditing}
          selectedPostId={selectedPostId}
          setIsTodoEditing={setIsTodoEditing}
          setSelectedPostId={setSelectedPostId}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
};
