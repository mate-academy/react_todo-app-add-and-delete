import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../TododsContext/TodosContext';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  setTempTodo: (todo: Todo | null) => void,
};

export const Header: React.FC<Props> = ({ setTempTodo }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const {
    todos, setTodos, setErrorMessage, USER_ID,
  } = useContext(TodosContext);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  });

  const handleChangeTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');
    } else {
      setIsSubmiting(true);

      addTodo({
        title: todoTitle,
        completed: false,
        userId: USER_ID,
      })
        .then((newTodo: Todo) => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTodoTitle('');
        })
        .catch((error) => {
          setErrorMessage('Unable to add a todo');
          throw error;
        })
        .finally(() => {
          setTimeout(() => setErrorMessage(''), 3000);
          setTempTodo(null);
          setIsSubmiting(false);
        });
    }
  };

  const handleChangeToggle = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => {
      return {
        ...todo,
        completed: !isAllCompleted,
      };
    });

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleChangeToggle}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          ref={titleRef}
          onChange={handleChangeTodoTitle}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
