import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filter: FilterType;
  updateCompleted: (todoItem: Todo) => void;
  isLoadingIds: number[];
  changeTodoId: number | null;
  newTitle: string;
  setNewTitle: (e: string) => void;
  handleDoubleClick: (todoItem: Todo) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoItem: Todo,
  ) => void;
  handleBlur: (todoItem: Todo) => void;
  deleteTodoHandler: (todoId: number) => void;
};
export const Section: React.FC<Props> = ({
  todos,
  filter,
  updateCompleted,
  isLoadingIds,
  changeTodoId,
  newTitle,
  setNewTitle,
  handleDoubleClick,
  handleKeyDown,
  handleBlur,
  deleteTodoHandler,
}) => {
  const todoFilter = todos.filter(tod => {
    if (filter === FilterType.Active) {
      return !tod.completed;
    }

    if (filter === FilterType.Completed) {
      return tod.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoFilter.map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todoItem={todoItem}
          updateCompleted={updateCompleted}
          isLoadingIds={isLoadingIds}
          changeTodoId={changeTodoId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleDoubleClick={handleDoubleClick}
          handleKeyDown={handleKeyDown}
          handleBlur={handleBlur}
          deleteTodoHandler={deleteTodoHandler}
        />
      ))}
    </section>
  );
};
