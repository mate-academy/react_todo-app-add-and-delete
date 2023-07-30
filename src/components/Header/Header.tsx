import { FormEvent } from 'react';
import cn from 'classnames';
import { useAppContext } from '../Context/AppContext';
import { client } from '../../utils/fetchClient';
import { getTodos } from '../../api/todos';

export const Header = () => {
  const {
    userId,
    todos,
    setTodos,
    todoTitle,
    setTodoTitle,
    setIsError,
  } = useAppContext();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const newTodo = {
      title: todoTitle,
      userId,
      completed: false,
    };

    client.post('/todos/', newTodo)
      .then(() => {
        getTodos(userId)
          .then(setTodos);
      })
      .catch(() => {
        setIsError('add');
      });
    setTodoTitle('');
  };

  const handleToggleAll = () => {
    if (todos.some(todo => !todo.completed)) {
      const newTodos = [...todos].map((item) => {
        client.patch(`/todos/${item.id}`, { completed: true })
          .catch(() => {
            setIsError('update');
          });

        return { ...item, completed: true };
      });

      setTodos(newTodos);
    } else {
      const newTodos = [...todos].map((item) => {
        client.patch(`/todos/${item.id}`, { completed: false });

        return { ...item, completed: false };
      });

      setTodos(newTodos);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todoTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
