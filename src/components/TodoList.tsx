import React from 'react';
import { useCurrentState } from '../store/reducer';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';
import { getFilteredTodos } from '../utils/getFilteredTodos';

interface Props {
  tempTodo: null | Todo;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({ tempTodo, inputRef }) => {
  const { todos, filterField } = useCurrentState();

  const visibleTodos: Todo[] = getFilteredTodos(filterField, todos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoComponent todo={todo} inputRef={inputRef} key={todo.id} />
      ))}
      {tempTodo !== null && (
        <TodoComponent todo={tempTodo} isTemp={true} inputRef={inputRef} />
      )}
    </section>
  );
};
