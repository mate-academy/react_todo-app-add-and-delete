import React from 'react';
import { TodoHeader } from '../TodoHeader';
import { TodoBody } from '../TodoBody';
import { TodoFooter } from '../TodoFooter';

import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todos: Todo[],
  countOfTodos: number,
  countOfLeftTodos: number,
  hasActiveTodo: boolean,
  visibleTodos: Todo[],
  filterTodos: (filterBy: FilterStatus) => void;
  filterStatus: FilterStatus,
  onChangeTitle: (title: string) => void;
  todoTitle: string;
  createNewTodo: (title: string) => void;
  isLoading: boolean;
  deleteTodo: (todoId: number) => void;
  deletedTodoId: number[],
  onCompleteTodo: (todoId: number) => void;
  deleteAllCompletedTodos: () => void;
};

export const TodoContent: React.FC<Props> = React.memo(({
  newTodoField,
  todos,
  countOfTodos,
  countOfLeftTodos,
  hasActiveTodo,
  visibleTodos,
  filterTodos,
  filterStatus,
  onChangeTitle,
  todoTitle,
  createNewTodo,
  isLoading,
  deleteTodo,
  deletedTodoId,
  onCompleteTodo,
  deleteAllCompletedTodos,
}) => (
  <div className="todoapp__content">
    <TodoHeader
      countOfTodos={countOfTodos}
      newTodoField={newTodoField}
      onChangeTitle={onChangeTitle}
      todoTitle={todoTitle}
      createNewTodo={createNewTodo}
      isAdding={isLoading}
    />

    {todos.length > 0
      && (
        <>
          <TodoBody
            visibleTodos={visibleTodos}
            isLoading={isLoading}
            todoTitle={todoTitle}
            deleteTodo={deleteTodo}
            deletedTodoId={deletedTodoId}
            onCompleteTodo={onCompleteTodo}
          />

          <TodoFooter
            hasActiveTodo={hasActiveTodo}
            filterTodos={filterTodos}
            filterStatus={filterStatus}
            countOfLeftTodos={countOfLeftTodos}
            deleteAllCompletedTodos={deleteAllCompletedTodos}
          />
        </>
      )}
  </div>
));
