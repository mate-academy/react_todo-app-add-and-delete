import { useEffect, useState } from 'react';

import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';
import { TodoFooter } from './TodoFooter';
import { TodoError } from './TodoError';

import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filter';
import { MessageError } from '../types/ErrorMessage';

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<MessageError>(
    MessageError.default,
  );
  const [loading, setLoading] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setErrorMessage(MessageError.loadError);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isError) {
        setIsError(false);
        setErrorMessage(MessageError.default);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isError]);

  const addTodo = (str: string) => {
    setLoading(true);

    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: str.trim(),
      completed: false,
    });

    return todoService
      .createTodo(str)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);

        return true;
      })
      .catch(() => {
        setIsError(true);
        setErrorMessage(MessageError.addError);

        return false;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setDeletingTodoIds(current => [...current, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        return true;
      })
      .catch(() => {
        setIsError(true);
        setErrorMessage(MessageError.deleteError);

        return false;
      })
      .finally(() => {
        setDeletingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const deleteCompletedTodo = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      setIsError(true);
      setErrorMessage(MessageError.deleteError);
    }
  };

  const filterTodos = () => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos: Todo[] = filterTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          addTodo={addTodo}
          todos={todos}
          loading={loading}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              loading={loading}
              deleteTodo={deleteTodo}
              deletingTodoIds={deletingTodoIds}
            />
            <TodoFooter
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              deleteCompletedTodo={deleteCompletedTodo}
            />
          </>
        )}
      </div>

      <TodoError
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
