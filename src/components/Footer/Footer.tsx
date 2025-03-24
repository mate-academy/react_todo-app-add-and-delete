import React from 'react';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { Filter } from '../Filter';
import { deleteTodo } from '../../api/todos';

type Props = {
  todoList: Todo[];
  activeFilter: string;
  removeTodo: (id: number) => void;
  setActiveFilter: (filter: FilterType) => void;
  showErrorMessage: (message: string, delay?: number) => void;
};

export const Footer: React.FC<Props> = ({
  todoList,
  activeFilter,
  removeTodo,
  setActiveFilter,
  showErrorMessage,
}) => {
  const getRemainingTodos = () => {
    return todoList.reduce((counter, currentTodo) => {
      return currentTodo.completed ? counter : counter + 1;
    }, 0);
  };

  const isAllTodosNotCompleted = () => {
    return todoList.every(todo => !todo.completed);
  };

  const handlerClearCompleted = () => {
    todoList.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => removeTodo(todo.id))
          .catch(() => showErrorMessage('Unable to delete a todo'));
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getRemainingTodos()} items left
      </span>

      <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handlerClearCompleted}
        disabled={isAllTodosNotCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
