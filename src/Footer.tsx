import { useEffect, useState } from 'react';
import { Todo } from './Todo';

enum TodoStatus {
  all,
  active,
  completed,
}

interface Props {
  handleFilterTodos:(status: TodoStatus) => void,
  handleClearCompleted: () => void,
  status: TodoStatus,
  todosList: Todo[];
}

export const Footer: React.FC<Props> = (
  {
    handleFilterTodos,
    handleClearCompleted,
    status,
    todosList,
  },
) => {
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [itemsLeft, setItemsLeft] = useState(0);

  useEffect(() => {
    setItemsCompleted(todosList.filter(todo => todo.completed).length);
    setItemsLeft(todosList.length - itemsCompleted);
  }, [todosList]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${status === TodoStatus.all ? 'selected' : ''}`}
          onClick={
            () => handleFilterTodos(TodoStatus.all)
          }
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === TodoStatus.active ? 'selected' : ''}`}
          onClick={
            () => handleFilterTodos(TodoStatus.active)
          }
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === TodoStatus.completed ? 'selected' : ''}`}
          onClick={
            () => handleFilterTodos(TodoStatus.completed)
          }
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleClearCompleted()}
        disabled={itemsCompleted === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
