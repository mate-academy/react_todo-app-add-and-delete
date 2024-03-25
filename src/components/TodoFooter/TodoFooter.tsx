import React from 'react';

import TodoFilter from '../TodoFilter';

import { useTodos } from '../../hooks/useTodos';

const Footer: React.FC = () => {
  const { todos, filter, setFilter, onDeleteTodo } = useTodos();

  const isClearButtonVisible = todos.some(todo => todo.completed);
  const amountItemsLeft = todos.filter(todo => !todo.completed).length;

  const handleDeletetodo = (todoId: number) => {
    onDeleteTodo(todoId);
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletetodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {amountItemsLeft} items left
      </span>

      <TodoFilter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!isClearButtonVisible}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
