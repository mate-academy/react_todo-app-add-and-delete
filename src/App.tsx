/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterSelectEnum } from './types/FilterSelectType';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  //#region UseHooks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterSelectEnum>(
    FilterSelectEnum.All,
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const allTodos = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isClearTodos = useRef<boolean>(false);
  const isToggle = useRef<boolean>(false);

  //#endregion

  //#region Function

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setErrorMessage('');
      setLoading(true);

      const todoToDelete = todos.find(todo => todo.id === todoId);

      if (todoToDelete && !isClearTodos.current) {
        setSelectedTodo(todoToDelete);
      }

      try {
        await todoService.deleteTodo(todoId);
        setTodos(curentTodos => curentTodos.filter(todo => todo.id !== todoId));
        allTodos.current -= 1;
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
        throw error;
      } finally {
        inputRef.current?.focus();
        setLoading(false);
        setSelectedTodo(null);
        isClearTodos.current = false;
      }
    },
    [todos],
  );

  const addTodo = useCallback(async ({ title, userId, completed }: Todo) => {
    setErrorMessage('');
    setLoading(true);
    setTodos(currentTodos => [
      ...currentTodos,
      { title, userId, completed, id: 0 },
    ]);

    try {
      const newTodo = await todoService.addTodo({ title, userId, completed });

      allTodos.current += 1;

      return newTodo;
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    } finally {
      setLoading(false);
      setSelectedTodo(null);
    }
  }, []);

  const updateTodo = useCallback(async (todoToUpdate: Todo) => {
    setErrorMessage('');
    setLoading(true);

    setSelectedTodo(null);
    if (!isToggle.current) {
      setSelectedTodo(todoToUpdate);
    }

    todoService
      .updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodo => {
          return currentTodo.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setSelectedTodo(null);
        isToggle.current = false;
      });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmiting(true);

      if (!newTodoTitle.trim()) {
        setErrorMessage('Title should not be empty');
        setIsSubmiting(false);

        return;
      }

      const tempTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        id: 0,
        userId: todoService.USER_ID,
      };

      setSelectedTodo(tempTodo);

      addTodo(tempTodo)
        .then(data => {
          if (data) {
            setTodos([...todos, data]);
            setNewTodoTitle('');
          }
        })
        .catch(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== tempTodo.id),
          );
        })
        .finally(() => {
          setTimeout(() => inputRef.current?.focus(), 0);
          setIsSubmiting(false);
        });
    },
    [newTodoTitle, addTodo, todos],
  );

  const handleUpdateTitle = useCallback(
    (data: Todo) => {
      if (!data.title.trim().length) {
        deleteTodo(data.id);
        setTimeout(() => setSelectedTodo(null), 0);

        return;
      }

      updateTodo(data);
    },
    [updateTodo, deleteTodo],
  );

  const handleUpdateCompleted = useCallback(
    async (data: Todo, bool: boolean = data.completed) => {
      const newObject = {
        title: data.title,
        completed: !bool,
        id: data.id,
        userId: data.userId,
      };

      updateTodo({ ...newObject });

      return newObject;
    },
    [updateTodo],
  );

  const checkTodoCompleted = useCallback(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const handleToggleActivate = useCallback(() => {
    const toggleBoolean = checkTodoCompleted() === allTodos.current;

    isToggle.current = true;

    todos.map(todo => {
      handleUpdateCompleted(todo, toggleBoolean).then(data => {
        if (data) {
          updateTodo(data);
        }
      });
    });
  }, [handleUpdateCompleted, todos, updateTodo, checkTodoCompleted, allTodos]);

  const handleClearCompleted = useCallback(() => {
    isClearTodos.current = true;
    todos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos, deleteTodo]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [handleSubmit]);

  useEffect(() => {
    setErrorMessage('');
    const delayTimer = setTimeout(() => setLoading(true), 200);

    todoService
      .getTodos()
      .then(data => {
        allTodos.current = data.length;

        return data.filter(todo => {
          if (selectedFilter === FilterSelectEnum.Completed) {
            return todo.completed;
          }

          if (selectedFilter === FilterSelectEnum.Active) {
            return !todo.completed;
          }

          return true;
        });
      })
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        clearTimeout(delayTimer);
        setTimeout(() => setLoading(false), 500);
      });
  }, [selectedFilter]);

  useEffect(() => {
    if (errorMessage.length) {
      const delayTimer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(delayTimer);
    }

    return;
  }, [errorMessage]);

  //#endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          allTodos={allTodos}
          isSubmiting={isSubmiting}
          newTodoTitle={newTodoTitle}
          handleSubmit={handleSubmit}
          setNewTodoTitle={setNewTodoTitle}
          checkTodoCompleted={checkTodoCompleted}
          handleToggleActivate={handleToggleActivate}
        />

        <TodoList
          todos={todos}
          loading={loading}
          inputRef={inputRef}
          selectedTodo={selectedTodo}
          deleteTodo={deleteTodo}
          handleUpdateTitle={handleUpdateTitle}
          handleUpdateCompleted={handleUpdateCompleted}
        />

        {Boolean(allTodos.current || todos.length) && (
          <Footer
            todos={todos}
            allTodos={allTodos}
            selectedFilter={selectedFilter}
            onSelectedFilter={setSelectedFilter}
            checkTodoCompleted={checkTodoCompleted}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
