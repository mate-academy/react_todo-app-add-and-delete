/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import * as todoService from '../../api/todos';

import { TodosContext } from '../TodosContext';

import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';

export const TodoHeader: React.FC = () => {
  const {
    USER_ID,
    todos,
    setTodos,
    setTodoError,
  } = useContext(TodosContext);
  const [inputQuery, setInputQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (inputQuery.trim() === '') {
      setTodoError(Error.EmptyTitleError);

      return;
    }

    todoService.createTodo({
      title: inputQuery,
      completed: false,
      userId: USER_ID,
    }).then((newTodo: Todo) => {
      setTodos(prevTodos => [...prevTodos, newTodo]);
    }).catch(() => setTodoError(Error.AddTodoError));

    setInputQuery('');
  };

  const handleCompleateSwitcher = () => {
    const hasCompleated = todos.some(todo => !todo.completed);

    const switchedTodos = todos.map(todo => {
      return ({
        ...todo,
        completed: hasCompleated,
      });
    });

    setTodos(switchedTodos);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleCompleateSwitcher}
      />

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
        />
      </form>
    </header>
  );
};
