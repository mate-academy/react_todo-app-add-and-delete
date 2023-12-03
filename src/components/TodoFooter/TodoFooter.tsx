import * as dataOperations from '../../api/todos';

import { Todo } from '../../types/Todo';

import { TodoSelecet } from '../TodoSelect/TodoSelect';

type Props = {
  onTodoSelected: (value: string) => void,
  deleteTodos: (value: number) => void,
  setTodos: (value: React.SetStateAction<Todo[]>) => void,
  onErrorMessage: (value: string) => void,
  showErrorMessage: () => void,
  isTodoSelected: string,
  count: number,
  todos: Todo[],
};

export const TodoFooter: React.FC<Props> = ({
  onTodoSelected,
  setTodos,
  onErrorMessage,
  isTodoSelected,
  count,
  todos,
}) => {
  const completedTodos = todos.filter(todo => todo.completed === true);

  const deleteCompletedTodos = (todoArray: Todo[]) => {
    setTodos(currentTodo => currentTodo.filter(
      todo => !completedTodos.includes(todo),
    ));

    onErrorMessage('');

    return dataOperations.deleteCompletedTodos(todoArray)
      .catch((error) => {
        setTodos(todos);
        onErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      <TodoSelecet
        onTodoSelected={onTodoSelected}
        isTodoSelected={isTodoSelected}
      />

      {completedTodos.length !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => deleteCompletedTodos(completedTodos)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
