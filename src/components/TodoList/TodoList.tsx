import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { ListFooter } from '../ListFooter';
import { FilterType } from '../../types/Filter';
import { TodoHandlers } from '../../types/TodoHandlers';

interface TodoListProps {
  todos: Todo[];
  allTodos: Todo[];
  filter: FilterType;
  handlers: TodoHandlers;
  onDeleteCompleted: () => void;
  onFocusInput?: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  allTodos,
  filter,
  handlers,
  onDeleteCompleted,
  onFocusInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handlers={handlers}
          onFocusInput={onFocusInput}
        />
      ))}
      <ListFooter
        todos={allTodos}
        filter={filter}
        onDeleteCompleted={onDeleteCompleted}
      />
    </section>
  );
};
