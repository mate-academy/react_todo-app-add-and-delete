import React from 'react';
import { Filter } from '../types/Filter';
import { TodoSelecet } from './TodoSelected';
import * as dataOperations from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  onTodoSelected: (value: Filter) => void,
  filter: string,
  count: number,
  setTodos: (value: React.SetStateAction<Todo[]>) => void,
  onErrorMessage: (value: string) => void,
  todos: Todo[],
};

export const TodoFooter: React.FC<Props> = ({
  onTodoSelected,
  filter,
  count,
  todos,
  setTodos,
  onErrorMessage,
}) => {
  const completedTodos = todos.filter(todo => todo.completed === true);

  const deleteCompletedTodos = (todoArray: Todo[]) => {
    setTodos(currentTodo => currentTodo.filter(
      todo => !completedTodos.includes(todo),
    ));

    onErrorMessage('');

    return dataOperations.deleteCompletedTodos(todoArray)
      .catch(() => {
        setTodos(todos);
        onErrorMessage('Unable to delete a todo');
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      <TodoSelecet
        onTodoSelected={onTodoSelected}
        filter={filter}
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
