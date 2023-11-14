import React, { useContext } from 'react';
import { TodoFilter } from './TodoFilter';
import { TodosContext } from './TodosContext';
import { deleteTodos } from '../api/todos';

export const TodosFooter: React.FC = () => {
  const {
    todos,
    setErrorMessage,
    setTodos,
  } = useContext(TodosContext);

  const todosLeft = todos.filter(todo => !todo.completed).length;

  const clearComplete = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodos(todo.id)
          .catch(() => {
            setErrorMessage('Unable to load todos');
          });
      }
    });
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearComplete}
        disabled={todosLeft === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
