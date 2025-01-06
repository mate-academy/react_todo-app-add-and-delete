import React, { FormEvent, useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { ErrorMessage } from './componens/ErrorMessage';
import { FilterType } from './types/FilterType';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { Header } from './componens/Header';
import { Section } from './componens/Section';
import { Footer } from './componens/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoadingIds, setIsLoadingIds] = useState<number[]>([]);
  const [changeTodoId, setChangeTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const addLoadingId = (id: number) => {
    setIsLoadingIds(prev => [...prev, id]);
  };

  const removeLoadingId = (
    id: number = isLoadingIds[isLoadingIds.length - 1],
  ) => {
    setIsLoadingIds(prev => prev.filter(isLoading => isLoading !== id));
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    const fetchTodos = () => {
      getTodos()
        .then(setTodos)
        .catch(() => handleError('Unable to load todos'));
    };

    fetchTodos();
  }, []);

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todo.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const newTodoId = {
      id: -1,
      userId: USER_ID,
      title: todo.trim(),
      completed: false,
    };

    setTodos(prev => [...prev, newTodoId]);

    addLoadingId(-1);
    
    postTodo({
      userId: USER_ID,
      title: todo.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => prev.map(t => (t.id === -1 ? newTodo : t)));
        setTodo('');
      })
      .catch(() => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== -1));
        handleError('Unable to add a todo');
      })
      .finally(() => {
        removeLoadingId(-1);
      });
  };

  const deleteTodoHandler = (todoId: number) => {
    addLoadingId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
      })
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        removeLoadingId(todoId);
      });
  };

  const updateCompleted = (todoItem: Todo) => {
    const { id, completed, userId, title } = todoItem;

    addLoadingId(id);

    updateTodo({
      id: id,
      completed: !completed,
      userId: userId,
      title: title,
    })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
        removeLoadingId(id);
      })
      .catch(() => handleError('Unable to update a todo'));
  };

  const handleBlur = (todoItem: Todo) => {
    const { id, completed, userId, title } = todoItem;

    addLoadingId(id);

    if (newTitle.trim() === title) {
      setChangeTodoId(null);
      removeLoadingId(id);

      return;
    }

    if (newTitle.trim() === '') {
      setChangeTodoId(null);
      deleteTodoHandler(todoItem.id);
      removeLoadingId(id);

      return;
    }

    const newTodo = {
      id: id,
      completed: completed,
      userId: userId,
      title: newTitle,
    };

    const oldTodo = {
      id: id,
      completed: completed,
      userId: userId,
      title: title,
    };

    setTodos(prevTodos =>
      prevTodos.map(t => (t.id === newTodo.id ? newTodo : t)),
    );

    updateTodo({
      id: id,
      completed: completed,
      userId: userId,
      title: newTitle,
    })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
        setChangeTodoId(null);
      })
      .catch(() => {
        handleError('Unable to update a todo');
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === oldTodo.id ? oldTodo : t)),
        );
      })
      .finally(() => {
        removeLoadingId(id);
      });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todoItem: Todo,
  ) => {
    if (e.key === 'Enter') {
      handleBlur(todoItem);
    }
  };

  const handleDoubleClick = (todoItem: Todo) => {
    setNewTitle(todoItem.title);
    setChangeTodoId(todoItem.id);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          todo={todo}
          todos={todos}
          setTodo={setTodo}
          updateCompleted={updateCompleted}
          isLoadingIds={isLoadingIds}
        />

        <Section
          todos={todos}
          filter={filter}
          updateCompleted={updateCompleted}
          isLoadingIds={isLoadingIds}
          changeTodoId={changeTodoId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleDoubleClick={handleDoubleClick}
          handleKeyDown={handleKeyDown}
          handleBlur={handleBlur}
          deleteTodoHandler={deleteTodoHandler}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            deleteTodoHandler={deleteTodoHandler}
          />
        )}
      </div>
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
