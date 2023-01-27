import {
  memo,
  useRef,
  useEffect,
  useContext,
} from 'react';
import autoAnimate from '@formkit/auto-animate';
import AddTodoForm from './AddTodoForm';
import { TodosList } from './TodosList';
import { updateTodo } from '../../api/todos';
import { TodosError } from './TodosError';
import { TodosFooter } from './TodosFooter';
import { TodosContext } from './TodosContext';

export const Todos = memo(
  () => {
    const { todos, setTodos } = useContext(TodosContext);
    const parentRef = useRef(null);

    useEffect(() => {
      if (parentRef.current) {
        autoAnimate(parentRef.current);
      }
    }, [parentRef]);

    const allChecked = todos.every(todo => todo.completed);

    const checkAll = () => {
      setTodos(prev => prev.map(todo => {
        if (!todo.completed) {
          updateTodo(todo.id, { completed: !allChecked });
        }

        return {
          ...todo,
          completed: !allChecked,
        };
      }));
    };

    const todosCount = todos.length;

    return (
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div ref={parentRef} className="todoapp__content">
          <header className="todoapp__header">
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={`todoapp__toggle-all ${allChecked ? 'active' : ''}`}
              aria-label="Toggle list"
              onClick={checkAll}
            />
            <AddTodoForm />
          </header>
          {!!todosCount && (
            <>
              <TodosList />
              <TodosFooter todosCount={todosCount} />
            </>
          )}
        </div>
        <TodosError />
      </div>
    );
  },
);
