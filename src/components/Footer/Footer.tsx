import { useEffect, useState } from 'react';

import { Todo } from '../../types/Todo';
import { ErrorTypes, FilterTypes } from '../../types/enums';
import { Filter } from './Filter';
import { deleteTodos } from '../../api/todos';
import { handleError, itemsLeft } from '../../utils/services';

type Props = {
  filterBy: FilterTypes;
  setFilterBy: (filterBy: FilterTypes) => void;
  todos: Todo[];
  setLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsFocused: (isFocused: boolean) => void;
  setErrorMessage: (errorMessage: ErrorTypes) => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  setLoading,
  todos,
  setTodos,
  setIsFocused,
  setErrorMessage,
}) => {
  const [isAnyTodoCompleted, setIsAnyTodoCompleted] = useState(false);

  const onDelete = (completedTodos: Todo[]) => {
    completedTodos.map(completedTodo => {
      setLoading(prev => [...prev, completedTodo.id]);

      deleteTodos(completedTodo.id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== completedTodo.id),
          );
          setIsFocused(true);
        })
        .catch(() => handleError(ErrorTypes.delErr, setErrorMessage))
        .finally(() => setLoading([]));
    });
  };

  useEffect(() => {
    if (todos.some(todo => todo.completed)) {
      setIsAnyTodoCompleted(true);
    } else {
      setIsAnyTodoCompleted(false);
    }
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft(todos)} items left
      </span>

      <Filter filterBy={filterBy} setFilterBy={setFilterBy} />

      <button
        type="button"
        className={'todoapp__clear-completed'}
        disabled={isAnyTodoCompleted === false}
        data-cy="ClearCompletedButton"
        onClick={() => onDelete(todos.filter(todo => todo.completed))}
      >
        Clear completed
      </button>
    </footer>
  );
};
