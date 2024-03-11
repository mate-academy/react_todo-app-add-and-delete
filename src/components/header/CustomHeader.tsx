import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { MyContext, MyContextData } from '../context/myContext';
import { USER_ID, addTodo } from '../../api/todos';

export const CustomHeader: React.FC = () => {
  const {
    data,
    query,
    inputRef,
    focusField,
    handleSetError,
    handleSetQuery,
    handleSetData,
    createTempTodo,
  } = useContext(MyContext) as MyContextData;
  const allTodosCompleted = data.every(elem => elem.completed);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    focusField();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetError('');

    if (query.trim() !== '') {
      const obj: Todo = {
        title: query.trim(),
        userId: USER_ID,
        completed: false,
      };

      setIsAdding(true);
      createTempTodo(true);
      addTodo(obj)
        .then(todo => {
          setIsAdding(false);
          handleSetQuery('');
          createTempTodo(false);
          handleSetData([...data, todo]);
        })
        .catch(() => {
          setIsAdding(false);
          createTempTodo(false);
          handleSetError('Unable to add a todo');
        })
        .finally(() => {
          setTimeout(() => {
            focusField();
          }, 0);
        });
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
