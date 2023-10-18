import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../TodosFilter/TodosFiter';
import { deleteTodo } from '../../api/todos';

type Props = {
  numberOfNotCompleted: number;
  filteredBy: FilterBy;
  setFilteredBy: (filterBy: FilterBy) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
};

export const Footer: React.FC<Props> = ({
  numberOfNotCompleted,
  filteredBy,
  setFilteredBy,
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const handleClearCompleted = () => {
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(error => {
          setErrorMessage('Unable to delete a todo');
          throw error;
        });
    });

    Promise.all(deletePromises)
      .then(() => {
        setTodos(todos.filter(todo => !completedTodos.some(
          completedTodo => completedTodo.id === todo.id,
        )));
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${numberOfNotCompleted} items left`}
      </span>

      <TodosFilter
        filteredBy={filteredBy}
        setFilteredBy={setFilteredBy}
      />

      {(todos.length !== numberOfNotCompleted) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
