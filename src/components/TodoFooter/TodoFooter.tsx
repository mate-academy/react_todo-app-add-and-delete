import { FC, useContext } from 'react';
import { FilterTodo } from '../FilterTodo';
import { TodosContext } from '../TodosContext/TodosContext';
import { deleteTodos } from '../../api/todos';
import { Todo, ErrorMessage } from '../../types';

interface Props {
  activeTodosCount: number
  completedTodos: Todo[]
}

export const TodoFooter: FC<Props> = ({
  activeTodosCount,
  completedTodos,
}) => {
  const {
    todos,
    setTodos,
    setError,
    setIsTodoDeleting,
  } = useContext(TodosContext);

  const handleDeleteCompletedTodos = (completedTodosIds: number[]) => {
    setIsTodoDeleting(completedTodosIds);

    completedTodosIds.forEach(id => {
      deleteTodos(id)
        .then(() => {
          setTodos((prevTodos: Todo[]) => (
            prevTodos.filter((prevTodo: Todo) => prevTodo.id !== id)
          ));
        })
        .catch((error: Error) => {
          setError(ErrorMessage.Delete);
          throw new Error(error.message);
        })
        .finally(() => {
          setIsTodoDeleting([]);
        });
    });
  };

  const handleClear = () => {
    const idsOfCompletedTodos
      = todos.filter(todo => todo.completed).map(todo => todo.id);

    handleDeleteCompletedTodos(idsOfCompletedTodos);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <FilterTodo />

      <button
        style={{
          visibility: completedTodos.length
            ? 'visible'
            : 'hidden',
        }}
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
