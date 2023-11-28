import React, { useContext } from 'react';
import { TodoContext } from './TodoContex';
import TodoFilter from './TodoFilter';

const TodoFooter: React.FC = () => {
  const {
    todos,
    setTodos,
  } = useContext(TodoContext);

  const handleDeleteCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  const currentTodosLength = todos.filter(todo => !todo.completed).length;

  const currentTodosMessage = currentTodosLength === 1
    ? ('1 items left')
    : (`${currentTodosLength} items left`);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {currentTodosMessage}
      </span>

      <TodoFilter />

      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
