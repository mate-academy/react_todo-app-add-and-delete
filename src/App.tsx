/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoForm } from './components/TodoForm/TodoForm';

const FILTER = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('');
  const [deletingIdList, setDeletingIdList] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isErrorHiden, setIsErrorHiden] = useState(true);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const addTodo = async (todo: Todo): Promise<void> => {
    try {
      await postService
        .addTodos(todo)
        .then(newTodo => setTodos([...todos, newTodo]));
      setIsErrorHiden(true);
    } catch (error) {
      setIsErrorHiden(false);
      setErrorMessage('Unable to add a todo');
      throw error;
    }
  };

  const deleteTodo = async (todoId: number) => {
    setDeletingIdList([...deletingIdList, todoId]);
    try {
      await postService.deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      focusInput();
      setDeletingIdList([]);
    }
  };

  const bulkDeleteTodo = async (todoList: Todo[]) => {
    setDeletingIdList(todoList.map(todo => todo.id));
    try {
      const deletedTodos = await Promise.allSettled(
        todoList.map(todo => postService.deleteTodo(todo.id)),
      );

      const successDeleted = todoList.filter(
        (_, index) => deletedTodos[index].status === 'fulfilled',
      );

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !successDeleted.some(t => t.id === todo.id),
        ),
      );

      if (deletedTodos.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
      }
    } finally {
      focusInput();
      setDeletingIdList([]);
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case FILTER.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTER.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = getFilteredTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            inputRef={inputRef}
            focusInput={focusInput}
            todos={filteredTodos}
            onAddTodo={addTodo}
            onTempTodo={setTempTodo}
            errorMessage={setErrorMessage}
            isErrorHidden={setIsErrorHiden}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo ? tempTodo : undefined}
            deleting={deletingIdList}
          />
        </section>

        {todos.length > 0 && (
          <Footer
            onFilter={setFilter}
            onDelete={bulkDeleteTodo}
            todos={todos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        isHidden={isErrorHiden}
        setIsHidden={setIsErrorHiden}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
