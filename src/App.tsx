/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';

const USER_ID = 0;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos: Todo[] = useMemo(() => {
    let preparedTodos = [...todos];

    if (filter !== Filter.ALL) {
      preparedTodos = preparedTodos.filter((todo) => {
        switch (filter) {
          case Filter.ACTIVE:
            return !todo.completed;

          case Filter.COMPLETED:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    return preparedTodos;
  }, [todos, filter]);

  const deleteTodo = (todoId: number) => {
    setTodos((currentTodos) => currentTodos
      .filter((todo) => todo.id !== todoId));

    todosService.deleteTodo(todoId).catch(() => {
      setTodos(todos);
      setError('Unable to delete a todo');
    });
  };

  function addTodo() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const data = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    setStatusResponse(true);

    todosService
      .createTodo(data)
      .then((newTodo) => {
        setTitle('');
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setStatusResponse(false);
      });
  }

  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  return (
    <section className="section container">
      <p className="title is-4">
        Copy all you need from the prev task:
        <br />
        <a href="https://github.com/mate-academy/react_todo-app-loading-todos#react-todo-app-load-todos">React Todo App - Load Todos</a>
      </p>

      <p className="subtitle">Styles are already copied</p>
    </section>
  );
};
