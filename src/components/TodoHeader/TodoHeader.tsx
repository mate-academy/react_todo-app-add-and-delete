/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ResponseError } from '../../types/enum';

type Props = {
  todos: Todo[];
  toggleTodosActive: () => void;
  setIsShowFooter: (arg: boolean) => void;
  setError: (arg: ResponseError) => void;
  isDisable: boolean;
  setIsLoading: (arg: boolean) => void;
  setCreatingTodoTitle: (arg: string) => void;
  headerAddTodo: (arg: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  toggleTodosActive,
  setError,
  isDisable,
  setIsLoading,
  setCreatingTodoTitle,
  headerAddTodo,
}) => {
  const [todoInput, setTodoInput] = useState('');

  const todoFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   if (!todoInput.trim()) {
      setIsLoading(false);

      return setError(ResponseError.EMPTY);
    }

    setIsLoading(true);
    setCreatingTodoTitle(todoInput);

    headerAddTodo(todoInput);

    return setTodoInput('');
  };

  const todoInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(ResponseError.NOT);
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
