/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todoService from './api/todos';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterValue, setFilterValue] = useState<Filter>(Filter.All);
  const [todosInTheBoot, setTodosInTheBoot] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const hideAllErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        hideAllErrorMessage();
      });
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  // DeleteTodo function
  const deleteTodo = (todoId: number) => {
    setTodosInTheBoot(currentBootTodos => [...currentBootTodos, todoId]);
    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodosInTheBoot(currentBootTodos =>
          currentBootTodos.filter(id => id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTodosInTheBoot(currentBootTodos =>
          currentBootTodos.filter(id => id !== todoId),
        );
        hideAllErrorMessage();
      });
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setTodosInTheBoot(currentBootTodos => [
      ...currentBootTodos,
      newTodo.userId,
    ]);

    todoService
      .postTodo(newTodo)
      .then(addingTodo => {
        setTodos(currentTodos => [...currentTodos, addingTodo]);
        setTodoTitle('');
        setTodosInTheBoot(currentBootTodos =>
          currentBootTodos.filter(id => id !== newTodo.userId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTodosInTheBoot(currentBootTodos =>
          currentBootTodos.filter(id => id !== newTodo.userId),
        );
        hideAllErrorMessage();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  // Handle Func for form submit
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = todoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');
      hideAllErrorMessage();

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todoService.USER_ID,
    });

    addTodo({
      title,
      completed: false,
      userId: todoService.USER_ID,
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          formSubmit={handleFormSubmit}
        />
        <TodoList
          todos={filteredTodos}
          todosBoot={todosInTheBoot}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterValue={filterValue}
            onClickFilter={setFilterValue}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
