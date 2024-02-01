/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodosContext } from '../TodoContext/TodoContext';
import * as todosServices from '../api/todos';
import { USER_ID } from '../variables/UserID';
import { wait } from '../utils/fetchClient';

export const Header: React.FC = () => {
  const {
    addTodo,
    makeAllCompleted,
    todos,
    setErrorMessage,
    setTempTodo,
    errorMessage,
  } = useContext(TodosContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const isAllTodosCompleted = todos.every(({ completed }) => completed);

  const handleToggleAll = () => {
    makeAllCompleted(todos);
  };

  const todoTitleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoTitleFocus.current) {
      todoTitleFocus.current.focus();
    }
  }, [todos, errorMessage]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setTodoTitle('');
      wait(3000).then(() => setErrorMessage(''));
    }

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!todoTitle.trim()) {
      setDisableInput(true);
      setTempTodo({
        id: 0,
        title: todoTitle.trim(),
        userId: USER_ID,
        completed: false,
      });

      todosServices.createTodos({
        title: todoTitle.trim(),
        userId: USER_ID,
        completed: false,
      }).then(response => {
        setTodoTitle('');
        addTodo(response);
        setTempTodo(null);
      })
        .catch(() => {
          setErrorMessage('Unable to add a todo');

          wait(3000).then(() => {
            setTempTodo(null);
            setErrorMessage('');
          });
        })
        .finally(() => {
          setDisableInput(false);
        });
    }
  };

  return (
    <header className="todoapp__header">

      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled={!isAllTodosCompleted}
        onClick={handleToggleAll}
      />

      <form
        onSubmit={(event) => handleOnSubmit(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoTitleFocus}
          value={todoTitle}
          disabled={disableInput}
          onChange={(event) => setTodoTitle(event.currentTarget.value)}
        />
      </form>
    </header>
  );
};
