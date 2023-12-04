import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { postTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';
import { TodosContext } from '../TodosContext';

export const Header: React.FC = () => {
  const {
    todos, setTodos, userId, setErrorMassage, setTempTodo,
  } = useContext(TodosContext);
  const [title, setTitile] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  });

  function addTodo() {
    setTempTodo({
      id: 0, userId, title, completed: false,
    });
    if (title.trim().length === 0) {
      setErrorMassage(ErrorType.EMPTY_TITLE);
      setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
    } else {
      postTodo({ userId, title, completed: false })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTitile('');
        })
        .catch(() => setErrorMassage(ErrorType.ADD_ERROR))
        .finally(() => {
          setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
          setIsPosting(false);
          setTempTodo(null);
        });
    }
  }

  const hangleCompleteAll = () => {
    const index = todos.findIndex(todo => todo.completed === false);
    const newTodos = todos.map(todo => {
      const comp = !todos[index === -1 ? 0 : index].completed;

      return { ...todo, completed: comp };
    });

    setTodos(newTodos);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitile(e.target.value);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    addTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        aria-label="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={hangleCompleteAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={submit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={isPosting}
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
