import classNames from 'classnames';
import { useState } from 'react';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';
import { postTodo } from '../api/todos';

type Props = {
  USER_ID: number;
  counterItemLeft: number | undefined;
  setTypeError: (typeError: Errors) => void;
  todoList: Todo[] | null;
  setTempTodo: (tempTodo: Todo | null) => void;
  setTodoList: (todoList: Todo[] | null) => void;
};

export const Header: React.FC<Props> = ({
  USER_ID,
  counterItemLeft,
  setTypeError,
  todoList,
  setTempTodo,
  setTodoList,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const submitHandler = (e:React.SyntheticEvent) => {
    e.preventDefault();

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    if (!newTodoTitle) {
      setTypeError(Errors.EMPTY);
    } else {
      postTodo(USER_ID, {
        title: newTodoTitle,
        completed: false,
      })
        .then(result => {
          if (todoList) {
            const newArray = [...todoList];

            setNewTodoTitle('');
            newArray.push(result);
            setTodoList(newArray);
            setTempTodo(null);
          }
        })
        .catch(() => {
          setTypeError(Errors.ADD);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { 'is-invisible': todoList?.length === 0 || !todoList },
          { active: (!counterItemLeft) },
        )}
      />

      <form
        onSubmit={submitHandler}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={todoList === null}
          value={newTodoTitle}
          onChange={(e) => {
            setNewTodoTitle(e.target.value);
          }}
        />
      </form>
    </header>
  );
};
