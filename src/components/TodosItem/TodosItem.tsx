import classNames from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, patchTodo } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todo: Todo,
  isLoadAllDelete: boolean,
  setErrorsArgument: (argument: Error | null) => void,
  todos: Todo[] | null,
  setTodos: (arg: Todo[]) => void,
};

export const TodosItem: React.FC<Props> = ({
  todo,
  todos,
  isLoadAllDelete,
  setErrorsArgument,
  setTodos,
}) => {
  const [query, setQuery] = useState('');
  const [isLoad, setisLoad] = useState(false);

  const user = useContext(AuthContext);

  const deleteTodosItem = async (todoId: number) => {
    if (user) {
      setisLoad(true);
      setErrorsArgument(null);
      await deleteTodo(todoId)
        .then(() => {
          if (todos) {
            setTodos(
              todos.filter((item) => item.id !== todoId),
            );
          }
        })
        .catch(() => setErrorsArgument(Error.Delete));
      setisLoad(false);
    }
  };

  const setCompletedTodo = (completed = false) => {
    if (user && todos) {
      setisLoad(true);
      const data = {
        completed,
      };

      const getChangedTodos = () => {
        if (todos) {
          const todosList = [...todos];

          todosList[todos.indexOf(todo)].completed = completed;

          return todosList;
        }

        return [];
      };

      patchTodo(todo.id, data)
        .catch(() => setErrorsArgument(Error.Update))
        .finally(() => {
          setTodos(getChangedTodos());
          setisLoad(false);
        });
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => setCompletedTodo(!todo.completed)}
        />
      </label>

      <span
        onDoubleClick={() => setQuery(todo.title)}
        data-cy="TodoTitle"
        className="todo__title"
      >
        {query || todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodosItem(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay',
            {
              'is-active': isLoad
              || todo.id === 0
              || (isLoadAllDelete && todo.completed),
            })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
