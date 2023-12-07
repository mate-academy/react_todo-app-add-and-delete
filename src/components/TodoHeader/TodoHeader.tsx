/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { TodosContext } from '../TodosContext';

import { Error } from '../../types/Error';

export const TodoHeader: React.FC = () => {
  const {
    USER_ID,
    todos,
    addTodo,
    setTodoError,
    isAdding,
    setIsAdding,
  } = useContext(TodosContext);
  const [inputQuery, setInputQuery] = useState('');
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (inputQuery.trim() === '') {
      setTodoError(Error.EmptyTitleError);

      return;
    }

    addTodo({
      title: inputQuery.trim(),
      completed: false,
      userId: USER_ID,
    }).finally(() => {
      setIsAdding(false);
      setInputQuery('');
    }).catch(() => {
      setInputQuery(inputQuery);
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      // onClick={handleCompleateSwitcher}
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
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

// I will need this in the next tasks

// const handleCompleateSwitcher = () => {
//   const hasCompleated = todos.some(todo => !todo.completed);

//   const switchedTodos = todos.map(todo => {
//     return ({
//       ...todo,
//       completed: hasCompleated,
//     });
//   });

//   setTodos(switchedTodos);
// };
