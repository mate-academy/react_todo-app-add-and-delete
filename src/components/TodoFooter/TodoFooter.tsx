import React from 'react';

import TodoFilter from '../TodoFilter';

import { deleteTodo } from '../../api/todos';
import { useTodos } from '../../hooks/useTodos';
import { Todo } from '../../types';

const Footer: React.FC = () => {
  // eslint-disable-next-line prettier/prettier
  const {
    todos,
    setTodos,
    filter,
    setFilter,
    setIsAllDeleted,
    handleError,
  } = useTodos();

  const isClearButtonVisible = todos.some(todo => todo.completed);
  const amountItemsLeft = todos.filter(todo => !todo.completed).length;

  const handleDeletetodo = (todoId: number) => {
    setIsAllDeleted(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setIsAllDeleted(false);
      });
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
