import React from 'react';
import { useCurrentState } from '../store/reducer';
import { FilterField } from '../types/FilterField';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

interface Props {
  tempTodo: null | Todo;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({ tempTodo, inputRef }) => {
  const { todos, filterField } = useCurrentState();

  let visibleTodos: Todo[] = [];

  switch (filterField) {
    case FilterField.Active:
      visibleTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterField.Completed:
      visibleTodos = todos.filter(todo => todo.completed);
      break;
    case FilterField.All:
      visibleTodos = [...todos];
  }

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
