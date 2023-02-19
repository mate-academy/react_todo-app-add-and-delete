/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodos } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterState } from './types/FilterState';
import { Todo } from './types/Todo';
import { Error } from './types/ErrorMessage';
import { TempTodo } from './types/tempTodo';

const USER_ID = 6268;

export const App: React.FC = () => {
  const [todoTitle, setTodoTitile] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterState.All);
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const getTodosFromServer = async () => {
    if (!USER_ID) {
      return;
    }

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (err) {
      setError(Error.Error);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const postTodosToServer = async (title: string) => {
    setIsLoading(true);
    setTempTodo({ id: 0, title, completed: false });

    try {
      const todo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      const newTodo = await postTodos(todo);

      setTodos(current => [...current, newTodo]);
    } catch (err) {
      setError(Error.AddTodoError);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const deleteTodosFromServer = async (todoId: number) => {
    try {
      setDeletingTodoId(todoId);
      await deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      setDeletingTodoId(null);
    } catch {
      setError(Error.DeleteTodoError);
    }
  };

  const updateTodo = (todoToUpdate: Todo) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === todoToUpdate.id) {
          return todoToUpdate;
        }

        return todo;
      }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodoTitle={todoTitle}
          onSetTodoTitle={setTodoTitile}
          newTitle={todoTitle}
          setError={setError}
          postTodosToServer={postTodosToServer}
          isloading={isloading}
        />

        <TodoList
          todos={todos}
          filterBy={filterBy}
          deleteTodosFromServer={deleteTodosFromServer}
          updateTodo={updateTodo}
          tempTodo={tempTodo}
          isloading={isloading}
          deletingTodoId={deletingTodoId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            filterState={filterBy}
            setFilterBy={setFilterBy}
            todos={todos}
            deleteTodosFromServer={deleteTodosFromServer}
          />
        )}

        <ErrorMessage
          errorMessage={error}
          setErrorMessage={setError}
        />
      </div>
    </div>
  );
};
