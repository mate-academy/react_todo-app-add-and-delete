/* eslint-disable jsx-a11y/label-has-associated-control */

import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodosContext } from './todosContext';
import { ActiveContext, AllContext, CompletedContext } from './filterContext';
import { ManageCheckboxContext } from './manageCheckboxContext';
import classNames from 'classnames';
import { deletePost } from '../api/todos';
import { ErrorConstext } from './errorMessageContext';
import { LoaderConstext } from './loaderContext';
import { SubmitingConstext } from './isSubmitingContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface ItemProps {
  item: Todo;
}

export const TodosItem: React.FC<ItemProps> = ({ item }) => {
  const { todos, setTodos } = useContext(TodosContext);
  const { isAllSelected } = useContext(AllContext);
  const { isActiveSelected } = useContext(ActiveContext);
  const { isCompletedSelected } = useContext(CompletedContext);
  const { setIsChecked } = useContext(ManageCheckboxContext);
  const { setErrorMessage } = useContext(ErrorConstext);
  const { isLoaderActive, setIsLoaderActive } = useContext(LoaderConstext);
  const { setIsSubmiting } = useContext(SubmitingConstext);

  const todosCopy = [...todos];

  const findIndex = todos.findIndex(element => element.id === item.id);

  if (todos.every(element => element.completed === true)) {
    setIsChecked(true);
  } else {
    setIsChecked(false);
  }

  const changePersonalComplete = () => {
    return todos.map(elem => {
      if (elem.id === item.id) {
        return {
          ...elem,
          completed: !item.completed,
        };
      }

      return elem;
    });
  };

  const handleDestroyButton = () => {
    todosCopy.splice(findIndex, 1);

    setIsSubmiting(true);

    deletePost(item.id)
      .then(() => setTodos(todosCopy))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsSubmiting(false);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const toRender = () => {
    if (isAllSelected === true) {
      return true;
    } else if (isActiveSelected && !item.completed) {
      return true;
    } else if (isCompletedSelected === true && item.completed === true) {
      return true;
    } else {
      return;
    }
  };

  const isTodoCompletedClass = classNames({
    todo: true,
    completed: item.completed,
  });

  const loaderClass = classNames({
    modal: true,
    overlay: true,
    'is-active': isLoaderActive,
  });

  return (
    <>
      {toRender() === true && (
        <div data-cy="Todo" className={isTodoCompletedClass}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => setTodos(changePersonalComplete())}
              checked={item.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {item.title}
          </span>

          <button
            onClick={handleDestroyButton}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div data-cy="TodoLoader" className={loaderClass}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
