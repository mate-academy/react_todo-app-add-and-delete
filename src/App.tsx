/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef } from 'react';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 4305;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
        newTodoFieldRef.current?.focus();
      });
  };

  const handleDelete = (id: number) => {
    setProcessingIds(current => [...current, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(processingId => processingId !== id),
        );
        newTodoFieldRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setProcessingIds(current => [...current, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id).then(() => {
        setTodos(current => current.filter(t => t.id !== todo.id));
      }),
    );

    Promise.all(deletePromises)
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => !completedIds.includes(id)),
        );
        newTodoFieldRef.current?.focus();
      });
  };

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          disabled={isSubmitting}
          inputRef={newTodoFieldRef}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              processingIds={processingIds}
              handleDelete={handleDelete}
              tempTodo={tempTodo}
            />

            <TodoFooter
              todos={todos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
