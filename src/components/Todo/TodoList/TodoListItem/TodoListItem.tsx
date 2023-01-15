import React, { useContext, useEffect } from 'react';
import { deleteTodo } from '../../../../api/todos';
import { ErrorContextType } from '../../../../types/ErrorContextType';
import { LoaderContextType } from '../../../../types/LoaderContextType';
import { Todo } from '../../../../types/Todo';
import { TodoContextType } from '../../../../types/TodoContextType';
import { ErrorContext } from '../../../Error/ErrorContext';
import { LoaderContext } from '../../LoaderContext';
import { TodoContext } from '../../TodoContext';

type Props = {
  todo: Todo,
};

const TodoListItem: React.FC<Props> = ({ todo }) => {
  const { setErrorText, setIsError }
  = useContext(ErrorContext) as ErrorContextType;
  const ref = React.createRef<HTMLDivElement>();
  const { isLoaderActive } = useContext(LoaderContext) as LoaderContextType;
  const { todos, setVisibleTodos }
  = useContext(TodoContext) as TodoContextType;

  useEffect(() => {
    if (isLoaderActive && ref && ref.current) {
      ref.current.classList.toggle('is-active');
    }
  }, []);

  const deleteTodoFromList = async () => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.classList.toggle('is-active');

    try {
      await deleteTodo(todo.id);

      setVisibleTodos(
        todos.filter((one: Todo) => todo.id !== one.id),
      );
    } catch (error) {
      setIsError(true);
      setErrorText('Unable to delete a todo');
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'} `}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>
      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={deleteTodoFromList}
      >
        ×
      </button>
      <div
        ref={ref}
        data-cy="TodoLoader"
        className="modal overlay"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};

export default TodoListItem;
