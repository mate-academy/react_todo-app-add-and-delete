/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { DispatchContext, TodosContext } from '../../../../Store';
import { USER_ID, addTodo } from '../../../../api/todos';

export const TodoInput: React.FC = () => {
  const { todos, isTodoDeleted } = useContext(TodosContext);
  const dispatch = useContext(DispatchContext);
  const [inputText, setInputText] = useState('');
  const [toggleAll, setToggleAll] = useState(false);
  const allCompleted = todos.every(todo => todo.completed);
  const [disabledInput, setDisabledInput] = useState(false);
  const inputRefAddTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTodoDeleted) {
      inputRefAddTodo.current?.focus();
      dispatch({ type: 'setIsTodoDeleted', payload: false });
    }

    if (inputRefAddTodo.current) {
      inputRefAddTodo.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTodoDeleted, disabledInput]);

  const handleToggleAll = () => {
    dispatch({
      type: 'setToggleAll',
      payload: allCompleted,
    });
    setToggleAll(!toggleAll);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputText.trim()) {
      dispatch({ type: 'setError', payload: 'Title should not be empty' });
      const timeout = setTimeout(() => {
        dispatch({ type: 'setError', payload: null });
        clearTimeout(timeout);
      }, 3000);

      return;
    }

    const todo = {
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
    };

    setDisabledInput(true);
    addTodo(todo)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        const { id, userId, title, completed } = response;

        const todoFromServer = {
          id,
          userId,
          title,
          completed,
        };

        dispatch({ type: 'addTodo', payload: todoFromServer });
        setInputText('');
      })
      .catch(() => {
        dispatch({ type: 'setError', payload: 'Unable to add a todo' });
      })
      .finally(() => {
        setDisabledInput(false);
        dispatch({ type: 'setTempTodo', payload: null });

        setTimeout(() => {
          dispatch({ type: 'setError', payload: null });
        }, 3000);
      });
    dispatch({ type: 'setTempTodo', payload: todo });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allCompleted,
          'is-hidden': !todos.length,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRefAddTodo}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={handleInputChange}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
