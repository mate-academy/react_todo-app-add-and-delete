import { useEffect, useState } from 'react';
import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/TodoItem';

interface Props {
  handleFilterTodos: (status: TodoStatus) => void;
  handleClearCompleted: () => void;
  status: TodoStatus;
  todosList: Todo[];
}

export default function FooterMenu({
  handleFilterTodos,
  handleClearCompleted,
  status,
  todosList,
}: Props) {
  const [itemsLeft, setItemsLeft] = useState(0);
  const [itemsCompleted, setItemsCompleted] = useState(0);

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
          className={`filter__link ${status === TodoStatus.ALL ? 'selected' : ''}`}
          onClick={() => handleFilterTodos(TodoStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === TodoStatus.ACTIVE ? 'selected' : ''}`}
          onClick={
            () => handleFilterTodos(TodoStatus.ACTIVE)
          }
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === TodoStatus.COMPLETED ? 'selected' : ''}`}
          onClick={
            () => handleFilterTodos(TodoStatus.COMPLETED)
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
}
