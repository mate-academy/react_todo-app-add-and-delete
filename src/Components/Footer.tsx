import React from 'react';
import { Todo } from '../types/Todo';
import { NavMenu } from './NavMenu';
import { ForComletedTodo } from '../types/enumFilter';

type Props = {
  todos: Todo[];
  condition: ForComletedTodo;
  setCondition: (condition: ForComletedTodo) => void;
  handleClearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  condition,
  setCondition,
  handleClearCompletedTodos,
}) => {
  const todosNoComleted = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosNoComleted} items${todosNoComleted !== 1 ? '' : ''} left`}
      </span>
      <NavMenu condition={condition} setCondition={setCondition} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
