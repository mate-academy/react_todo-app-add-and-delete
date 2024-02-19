import classNames from 'classnames';
import { useCallback, useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { TodosContext } from '../../utils/context';
import { TodoError } from '../../types/enums/TodoError';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
};

export const TodoComponent: React.FC<Props> = ({
  todo,
  isTempTodo,
}) => {
  const { completed, title } = todo;
  const [isLoaderIsActive, setLoaderIsActive] = useState(false);

  const {
    todos,
    setTodos,
    setIsErrorVisible,
    setErrorMessage,
    listOfAllCompletedTodos,
  } = useContext(TodosContext);

  const listOfAllCompletedId
  = listOfAllCompletedTodos.map(completedTodo => completedTodo.id);

  const deteleTodo = useCallback((item: Todo) => {
    client.delete(`/todos/${item.id}`)
      .then(() => {
        setTodos(todos.filter(el => el.id !== item.id));
      })
      .catch(() => {
        setIsErrorVisible(true);
        setErrorMessage(TodoError.UnableToDelete);
      })
      .finally(() => {
        setLoaderIsActive(false);
      });
  }, [setTodos, todos, setIsErrorVisible, setErrorMessage]);

  const handlerDeleteTodo = (item: Todo) => {
    setLoaderIsActive(true);
    deteleTodo(item);
  };

  return (
    <div className="todoapp__main" data-cy="TodoList">
      <li
        data-cy="Todo"
        className={classNames('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handlerDeleteTodo(todo)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            {
              'is-active':
              isLoaderIsActive
              || isTempTodo
              || listOfAllCompletedId.includes(todo.id),
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </li>
    </div>
  );
};
