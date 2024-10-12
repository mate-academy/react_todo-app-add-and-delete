/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { Todo } from './types/Todo';
import { Filter } from './types/Filters';
import { UserWarning } from './UserWarning';
import { createTodo, USER_ID, getTodos, deleteTodo } from './api/todos';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Error } from './components/error';

export const App: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.all);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function getVisibleTodos(filt: Filter) {
    switch (filt) {
      case Filter.active:
        return todos.filter(todo => !todo.completed);
      case Filter.completed:
        return todos.filter(todo => todo.completed);
      case Filter.all:
      default:
        return todos;
    }
  }

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setLoading(false));
  }, []);

  const allActive = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const active = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const complete = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
    setErrorMessage('');
    setLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    });

    createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })

      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function deleteOneTodo(todoId: number) {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  function deleteCompleted() {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteOneTodo(todo.id));
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          addTodo={addTodo}
          allActive={allActive}
          setErrorMessage={setErrorMessage}
          loading={loading}
        />

        <TodoList
          visibleTodos={getVisibleTodos(filter)}
          deleteOneTodo={deleteOneTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            active={active}
            complete={complete}
            deleteCompleted={deleteCompleted}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} />
    </div>
  );
};
