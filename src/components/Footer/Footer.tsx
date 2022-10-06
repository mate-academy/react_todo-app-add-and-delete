import { useMemo } from 'react';
import { Filter } from '../Filter';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  statuses: Status[];
  selectedStatusId: string;
  onStatusSelected: (value:Status) => void;
  todos: Todo[];
  setErrorNotification: (value: string) => void;
  setTodoId: (id: number) => void;
  setTodos: (todo: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  statuses,
  selectedStatusId,
  onStatusSelected,
  todos,
  setErrorNotification,
  setTodos,
}) => {
  const activeTodos = useMemo(() => {
    return todos.filter(
      ({ completed }) => !completed,
    );
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(
      ({ completed }) => completed,
    );
  }, [todos]);

  const deleteCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map(({ id }) => deleteTodo(id)));

      setTodos(activeTodos);
    } catch (error) {
      setErrorNotification('Unable to delete a todo');
    }
  };

  return (

    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>
      <Filter
        statuses={statuses}
        selectedStatusId={selectedStatusId}
        onStatusSelected={onStatusSelected}
      />
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
        style={{
          visibility: completedTodos.length <= 0 ? 'hidden' : 'visible',
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
