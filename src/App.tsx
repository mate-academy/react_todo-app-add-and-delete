import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TodoList } from './components/TodoList';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';
import { Filter } from './types/types';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]); // Для временных задач
  const [loadingError, setLoadingError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]); // Состояние для ID задач с лоадером

  const inputRef = useRef<HTMLInputElement>(null);
  const [filterSelected, setFilterSelected] = useState<Filter>(Filter.All);

  const filterTodos = useMemo(() => {
    switch (filterSelected) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterSelected]);

  useEffect(() => {
    getTodos()
      .then(todoList => {
        setTodos(todoList);
      })
      .catch(() => {
        setLoadingError('Unable to load todos');
        setTimeout(() => {
          setLoadingError('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const toggleTodoAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(prevTodos =>
      prevTodos.map(todo => ({ ...todo, completed: !allCompleted })),
    );
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setValidationError('Title should not be empty');
      setTimeout(() => {
        setValidationError('');
      }, 3000);
      if (inputRef.current) {
        inputRef.current.focus();
      }

      return;
    }

    const tempTodo: Todo = {
      id: Date.now(),
      title: inputText,
      completed: false,
      userId: 1129,
    };

    setTempTodos(prevTempTodos => [...prevTempTodos, tempTodo]);
    setLoadingTodos(prev => [...prev, tempTodo.id]); // Добавляем ID в массив загрузки

    addTodo(inputText)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodos(prevTempTodos =>
          prevTempTodos.filter(todo => todo.id !== tempTodo.id),
        );
        setInputText('');
        setValidationError('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setLoadingError('Unable to add a todo');
        setTempTodos(prevTempTodos =>
          prevTempTodos.filter(todo => todo.id !== tempTodo.id),
        );
        setTimeout(() => {
          setLoadingError('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(prev => prev.filter(id => id !== tempTodo.id)); // Удаляем ID из массива загрузки
      });
  };

  const deletePost = (id: number) => {
    setLoadingTodos(prev => [...prev, id]); // Добавляем ID в массив загрузки

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setLoadingError('Unable to delete a todo');
        setTimeout(() => {
          setLoadingError('');
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const clearErrors = () => {
    setLoadingError('');
    setValidationError('');
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const leftItem = todos.filter(todo => !todo.completed).length;
  const disabledButton = todos.every(todo => !todo.completed);

  const filterValues = Object.values(Filter);

  const allTodos = [...tempTodos, ...filterTodos]; // Объединяем временные задачи и отфильтрованные задачи

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={toggleTodoAll}
          />
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              disabled={loadingTodos.length > 0}
            />
          </form>
        </header>
        <TodoList
          todos={allTodos}
          toggleTodo={toggleTodo}
          deletePost={deletePost}
          loadingTodos={loadingTodos} // Передаем массив ID задач
        />
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {leftItem} items left
            </span>
            <nav className="filter" data-cy="Filter">
              {filterValues.map(filter => (
                <a
                  key={filter}
                  href={`#/${filter !== 'all' ? filter : ''}`}
                  className={cn('filter__link', {
                    selected: filterSelected === filter,
                  })}
                  data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                  onClick={() => setFilterSelected(filter)}
                >
                  {filter}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={disabledButton}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${loadingError || validationError ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrors}
        />
        {loadingError && <div>{loadingError}</div>}
        {validationError && <div>{validationError}</div>}
      </div>
    </div>
  );
};
