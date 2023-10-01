/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorMessageEnum } from '../../types/ErrorMessageEnum';
import { USER_ID } from '../../helpers/UserID';
import { postTodo } from '../../api/todos';
import { TodoList } from '../TodoList/TodoList';

interface Props {
  todos: Todo[],
  allTodos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<'' | ErrorMessageEnum>>,
}

export const TodoApp: React.FC<Props> = ({
  todos,
  allTodos,
  setTodos = () => { },
  setAllTodos = () => { },
  setErrorMessage = () => { },
}) => {
  const [value, setValue] = useState<string>('');
  const [disabledInput, setDisabledInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabledInput]); // !!

  const addNewTodo = async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setErrorMessage(ErrorMessageEnum.TitleError);

      return;
    }

    setDisabledInput(true);

    setTempTodo({
      title: trimmedValue,
      completed: false,
      userId: USER_ID,
      id: 0,
    });

    try {
      const newTodoWithoutID = {
        title: trimmedValue,
        completed: false,
        userId: USER_ID,
      };

      const newTodo = await postTodo(newTodoWithoutID);

      setAllTodos(prevTodos => [...prevTodos, newTodo]);
      setTodos(prevTodos => [...prevTodos, newTodo]); // ??
      setValue('');
    } catch {
      setErrorMessage(ErrorMessageEnum.AddTodoError);
    } finally {
      setTempTodo(null);
      setDisabledInput(false);
    }
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement> | null) => {
    event?.preventDefault();

    addNewTodo();
  };

  const handleSelectAllTodos = async () => {
    try {
      const isExistActive = [...allTodos]
        .filter(todo => !todo.completed).length;

      if (isExistActive !== 0) {
        const newTodos = await Promise.all(allTodos
          .map(todo => ({ ...todo, completed: true })));

        setAllTodos(newTodos);
        setTodos(newTodos);
      } else {
        const newTodos = await Promise.all(allTodos
          .map(todo => ({ ...todo, completed: false })));

        setAllTodos(newTodos);
        setTodos(newTodos);
      }
    } catch {
      setErrorMessage(ErrorMessageEnum.UpdateTodoError);
    }
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: allTodos.every(todo => todo.completed),
          })}
          onClick={handleSelectAllTodos}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={value}
            onChange={handleChangeInput}
            ref={inputRef}
            disabled={disabledInput}
          />
        </form>
      </header>

      <TodoList
        todos={todos}
        allTodos={allTodos}
        setTodos={setTodos}
        setAllTodos={setAllTodos}
        setErrorMessage={setErrorMessage}
        tempTodo={tempTodo}
      />
    </>
  );
};
