import React from 'react';
import { TodoForm } from '../TodoForm';

interface Props {
  isTodosAvailable: boolean,
  newTodoField: React.RefObject<HTMLInputElement>,
  todoTitle: string,
  setTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  addTodo: () => void,
  isAdding: boolean,
}

export const TodoHeader: React.FC<Props> = ({
  isTodosAvailable,
  newTodoField,
  todoTitle,
  setTodoTitle,
  addTodo,
  isAdding,
}) => (
  <header className="todoapp__header">
    {isTodosAvailable && (
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />
    )}
    <TodoForm
      newTodoField={newTodoField}
      todoTitle={todoTitle}
      setTodoTitle={setTodoTitle}
      addTodo={addTodo}
      isAdding={isAdding}
    />
  </header>
);
