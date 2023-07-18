/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ResponseError } from '../../types/enum';
import { getTodos, createTodo } from '../../api';

type Props = {
  todos: Todo[];
  toggleTodosActive: () => void;
  setIsShowFooter: (arg: boolean) => void;
  setRespError: (arg: ResponseError) => void;
  setTodos: (arg: Todo[]) => void;
  checkCompletedTodo: (arg: Todo[]) => void;
  userID: number;
  isDisable: boolean;
  setIsDisable: (arg: boolean) => void;
  setCreatingTodoTitle: (arg: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  toggleTodosActive,
  setIsShowFooter,
  setRespError,
  setTodos,
  checkCompletedTodo,
  userID,
  isDisable,
  setIsDisable,
  setCreatingTodoTitle,
}) => {
  const [todoInput, setTodoInput] = useState('');

  const todoFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDisable(true);

    if (!todoInput.trim()) {
      setIsDisable(false);

      return setRespError(ResponseError.EMPTY);
    }

    setCreatingTodoTitle(todoInput);

    createTodo(todoInput.trim(), userID)
      .then(() => {
        getTodos(userID).then((todoList) => {
          setTodos(todoList);
          checkCompletedTodo(todoList);
          setIsShowFooter(Boolean(todoList.length));
          setIsDisable(false);
          setCreatingTodoTitle('');
        });
      })
      .catch(() => setRespError(ResponseError.ADD));

    return setTodoInput('');
  };

  const todoInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRespError(ResponseError.NOT);
    setTodoInput(e.target.value);
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          onClick={toggleTodosActive}
        />
      )}

      <form onSubmit={todoFormHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoInput}
          disabled={isDisable}
          onChange={todoInputHandler}
        />
      </form>
    </header>
  );
};
