import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { ContextTodo } from '../ContextTodo';
import { USER_ID } from '../../utils/constant';
import { createTodo } from '../../api/todos';
import { ErrorMessage } from '../../types';

export const HeaderTodo = () => {
  const {
    title,
    setTitle,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setTempTodo,
  } = useContext(ContextTodo);

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  const changeValues = () => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(todoFromServer => {
        setTodos(currentTodo => [...currentTodo, todoFromServer]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodoError);
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabledButton(false);
      });
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabledButton(true);
      changeValues();
    } else {
      setErrorMessage(ErrorMessage.EmptyTitle);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const todosLeft = useMemo(() => {
    return !todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [errorMessage, todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: todosLeft })}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
      />

      {/* +Add a todo on form submit */}
      <form onSubmit={submitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleOnChange}
          disabled={isDisabledButton}
          ref={titleField}
        />
      </form>
    </header>
  );
};
