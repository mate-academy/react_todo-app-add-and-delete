/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {createTodo, deleteTodo, getTodos} from './api/todos';
import { Todo } from './types/Todo';
// import { UserWarning } from './UserWarning';
import Header from './components/Header/Header';
import { Status } from './types/Status';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { ErrorType } from './types/Error';
import { todoFilter } from './utils/todoFilter';

export const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [error, setError] = useState<ErrorType | null>(null);
    const [status, setStatus] = useState<Status>(Status.All);
    const [newTodoTitle, setNewTodoTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const filteredTodo = todoFilter(todos, status);

    const activeTodoCount = todos.reduce(
        (acc, todo) => (todo.completed ? acc : acc + 1),
        0,
    );
    const hasCompletedTodos = todos.some(todo => todo.completed);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const result = await getTodos();

                setTodos(result);
            } catch (e) {
                setError('load');

                setTimeout(() => {
                    setError(null);
                }, 3000);
            }
        };

        fetchTodo();
    }, [error, status]);

    const handleAddTodo = (event: React.FormEvent) => {
        event.preventDefault();

        if (!newTodoTitle.trim()) {
            return;
        }

        setIsLoading(true);
        createTodo(newTodoTitle.trim())
            .then(newTodo => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setTodos(prevTodos => [...prevTodos, newTodo]);
                setNewTodoTitle('');
            })
            .catch(() => setError('add'))
            .finally(() => setIsLoading(false));
    };

    const handleDeleteTodo = (id: number) => {
        setIsLoading(true);
        deleteTodo(id)
            .then(() => {
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            })
            .catch(() => setError('delete'))
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="todoapp">
            <h1 className="todoapp__title">todos</h1>

            <div className="todoapp__content">
                <Header
                    handleAddTodo={handleAddTodo}
                    newTodoTitle={newTodoTitle}
                    setNewTodoTitle={setNewTodoTitle}
                    isLoading={isLoading}
                />
                <TodoList
                    todos={filteredTodo}
                    onDeleteTodo={handleDeleteTodo}
                />
                <Footer
                    setStatus={setStatus}
                    status={status}
                    activeTodoCount={activeTodoCount}
                    hasCompletedTodos={hasCompletedTodos}
                />
            </div>

            <ErrorNotification error={error} setError={setError} />
        </div>
    );
};
