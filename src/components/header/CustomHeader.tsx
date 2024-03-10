import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { MyContext, MyContextData } from '../context/myContext';
import { USER_ID, addTodo } from '../../api/todos';

export const CustomHeader: React.FC = () => {
  const {
    data,
    query,
    handleSetError,
    handleSetQuery,
    handleFetchData,
    createTempTodo,
  } = useContext(MyContext) as MyContextData;
  const allTodosCompleted = data.every(elem => elem.completed);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the input element when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetError('');

    if (query.trim() !== '') {
      const obj: Todo = {
        title: query,
        userId: USER_ID,
        completed: false,
      };

      setIsAdding(true);
      addTodo(obj)
        .then(() => {
          setIsAdding(false);
          handleSetQuery('');
          handleFetchData();
        })
        .catch(() => {
          setIsAdding(false);
          handleSetError('Can`t add a todo');
        })
        .finally(() => createTempTodo(false));
    } else {
      handleSetError('Title should not be empty');
    }
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSetQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
