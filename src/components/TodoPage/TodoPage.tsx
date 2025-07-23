import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoMain } from '../TodoMain';
import {
  addPost,
  getTodos,
  updateTodo,
  USER_ID,
  deletePost,
} from '../../api/todos';
import { TodoHeader } from '../TodoHeader';
import { TodoFooter } from '../TodoFooter';
import { ErrorNotification } from '../ErrorNotification';
import { Filter } from '../../types/Enum';
import { TodoItem } from '../TodoItem';

export const TodoPage: React.FC = () => {
  const [titleMessage, setTitleMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const inputFocus = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filtered, setFiltered] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [deletingAllTodo, setDeletingAllTodo] = useState<number[] | null>(null);

  function loadTodos() {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    inputFocus.current?.focus();
  }, [isLoading, deletingTodoId, deletingAllTodo]);

  function toggleTodo(todoId: number) {
    setErrorMessage('');

    updateTodo(todoId).catch(() => setErrorMessage('Unable to update todo'));
  }

  function addTodo({ title, completed }: Todo) {
    setErrorMessage('');

    return addPost({ title, completed });
  }

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleMessage(event.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleMessage.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const temp: Todo = {
      id: 0,
      title: titleMessage.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    addTodo(temp)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitleMessage('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };

  const handleFilterChange = (filter: Filter) => {
    setCurrentFilter(filter);
  };

  useEffect(() => {
    let result = [...todos];

    if (currentFilter === Filter.Active) {
      result = result.filter(todo => !todo.completed);
    } else if (currentFilter === Filter.Completed) {
      result = result.filter(todo => todo.completed);
    }

    setFiltered(result);
  }, [todos, currentFilter]);

  const cleaningErrormessage = () => {
    setErrorMessage('');
  };

  function deleteTodo(todoId: number) {
    setDeletingTodoId(todoId);

    return deletePost(todoId)
      .then(() => {
        setTodos(currentPosts =>
          currentPosts.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTimeout(() => {
          setDeletingTodoId(null);
        }, 500);
      });
  }

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingAllTodo(completedIds);
    setIsLoading(true);

    const errors: number[] = [];

    for (const todo of completedTodos) {
      try {
        await deletePost(todo.id);
      } catch {
        errors.push(todo.id);
      }
    }

    if (errors.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !todo.completed || errors.includes(todo.id)),
    );

    setTimeout(() => {
      setDeletingAllTodo(null);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <div className="todoapp__content">
        <TodoHeader
          onSubmit={handleSubmit}
          onTitleChange={handleTitleChange}
          title={titleMessage}
          isDisabled={isLoading}
          inputRef={inputFocus}
        />

        {todos.length > 0 && (
          <TodoMain
            todos={filtered}
            toggleTodo={toggleTodo}
            onDeleted={deleteTodo}
            deletingTodoId={deletingTodoId}
            deletingAllTodo={deletingAllTodo}
          />
        )}

        {tempTodo && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoItem
              todo={tempTodo}
              onToggle={() => {}}
              isLoading
              onDeleted={() => deleteTodo(tempTodo.id)}
            />
          </section>
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            onDeletedCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onCleaning={cleaningErrormessage}
      />
    </>
  );
};
