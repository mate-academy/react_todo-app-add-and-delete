import { useContext } from 'react';
import { Filter } from '../Filter/Filter';
import { TodosContext } from '../TodosContext/TodosContext';
import { removeTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessages';

type Props = {
  activeTodos?: number;
  completedTodos?: number;
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  activeTodos,
}) => {
  const { todos, setTodos, handleErrorMessage } = useContext(TodosContext);

  const handleRemoveAllCompleted = () => {
    setTodos(todos.filter(value => !value.completed));

    todos.map((todo) => {
      if (todo.completed === true) {
        removeTodo(todo.id)
          .then()
          .catch(() => {
            setTodos(todos);
            handleErrorMessage(ErrorMessage.UNABLE_DELETE);
          });
      }

      return todo;
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleRemoveAllCompleted()}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
