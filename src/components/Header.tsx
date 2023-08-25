import {
  ChangeEvent, FormEvent, useContext, useState,
} from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { ErrorEnum } from '../types/ErrorEnum';

export const Header = () => {
  const [query, setQuery] = useState('');
  const {
    addTodo,
    setErrorAndClear,
    isInputDisabled,
    setTempTodo,
  } = useContext(GlobalContext);

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (query.trim() === '') {
      setErrorAndClear(ErrorEnum.EMPTY_TITLE, 3000);

      return;
    }

    if (query.trim()) {
      const todo = {
        title: query,
        userId: 11325,
        completed: false,
        id: 0,
      };

      setTempTodo(todo);
      addTodo({
        title: query,
        userId: 11325,
        completed: false,
      });
    }

    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle All"
      />

      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          onChange={onQueryChange}
          value={query}
        />
      </form>
    </header>
  );
};
