import {
  useContext,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { AppContext } from '../../context';

import { createTodo, editTodo } from '../../api/todos';
import { USER_ID } from '../../utils/const';
import { setErrorMessageAction } from '../../services/actions/errorActions';
import {
  createTodoAction,
  deleteTodoAction,
  editTodoAction,
} from '../../services/actions/todoActions';
import {
  removeUpdatedTodoIdAction,
  setUpdatedTodoIdAction,
} from '../../services/actions/updatedTodoIdActions';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const HeaderComponent:React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const isSelectedAll = ((): boolean => {
    if (!state.todos.length) {
      return false;
    }

    return state.todos.every(el => el.completed);
  })();

  const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTitle = title.trim();

    if (!newTitle) {
      setTitle('');
      dispatch(setErrorMessageAction('Title can\'t be empty'));

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const tempId = +new Date();

    dispatch(setErrorMessageAction(''));

    dispatch(createTodoAction(tempId, newTitle));

    dispatch(setUpdatedTodoIdAction(tempId));

    createTodo({
      userId: USER_ID,
      title: newTitle,
      completed: false,
    }).then((newTodo) => {
      dispatch(editTodoAction(newTodo, tempId));

      dispatch(removeUpdatedTodoIdAction(tempId));

      setTitle('');
    }).catch(() => {
      dispatch(deleteTodoAction(tempId));

      dispatch(removeUpdatedTodoIdAction(tempId));

      dispatch(setErrorMessageAction('Unable to add a todo'));
    })
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }
      });
  };

  const handleSelectAll = async () => {
    await state.todos.forEach(todo => {
      dispatch(setUpdatedTodoIdAction(todo.id));
      editTodo({
        ...todo,
        completed: !isSelectedAll,
      })
        .then((updatedTodo) => {
          dispatch(editTodoAction(updatedTodo));
          dispatch(removeUpdatedTodoIdAction(todo.id));
        }).catch(() => {
          if (!state.errorMessage) {
            dispatch(setErrorMessageAction('Can\'t update a todo'));
          }

          dispatch(removeUpdatedTodoIdAction(todo.id));
        });
    });
  };

  return (
    <header className="todoapp__header">
      {!!state.todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isSelectedAll },
          )}
          onClick={handleSelectAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          type="text"
          onChange={handleInput}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
