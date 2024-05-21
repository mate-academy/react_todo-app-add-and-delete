// import React, {
//     Dispatch,
//     FC,
//     ReactNode,
//     SetStateAction,
//     createContext,
//     useEffect,
//     useRef,
//     useState,
// } from 'react';
// import { Todo } from "../types/Todo";
// import { ErrorType } from "../types/Error";
// import { Status } from "../types/Status";
// import { deleteTodo, getTodos } from "../api/todos";
// import { todoFilter } from "../utils/todoFilter";
// import { ITempTodo } from "../types/TempTodo";
//
// interface IAppProvider {
//     children: ReactNode;
// }
//
// interface AppContextProps {
//     todos: Todo[];
//     filteredTodo: Todo[];
//     setTodos: Dispatch<SetStateAction<Todo[]>>;
//     setFilteredTodo: Dispatch<SetStateAction<Todo[]>>;
//     status: Status;
//     setStatus: Dispatch<SetStateAction<Status>>;
//     error: ErrorType | null;
//     setError: Dispatch<SetStateAction<ErrorType | null>>;
//     tempTodo: ITempTodo;
//     setTempTodo: Dispatch<SetStateAction<ITempTodo>>;
//     inputRef: React.RefObject<HTMLInputElement>;
//     handleDeleteTodo: (id: number) => void;
//     newTodoTitle: string;
//     setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
//     isDeleting: boolean;
//     setIsDeleting: Dispatch<SetStateAction<boolean>>;
//     isLoading: boolean;
//     setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }
//
// export const AppContext = createContext<AppContextProps>({
//     todos: [],
//     filteredTodo: [],
//     setTodos: () => {},
//     setFilteredTodo: () => {},
//     status: Status.All,
//     setStatus: () => {},
//     error: null,
//     setError: () => {},
//     tempTodo: {
//         isLoading: false,
//         todo: null,
//     },
//     setTempTodo: () => {},
//     inputRef: { current: null },
//     handleDeleteTodo: () => {},
//     newTodoTitle: '',
//     setNewTodoTitle: () => {},
//     isDeleting: false,
//     setIsDeleting: () => { },
//     isLoading: false,
//     setIsLoading: () => { },
// });
//
// export const AppProvider: FC<IAppProvider> = ({ children }) => {
//     const [todos, setTodos] = useState<Todo[]>([]);
//     const [error, setError] = useState<ErrorType | null>(null);
//     const [status, setStatus] = useState<Status>(Status.All);
//     const [newTodoTitle, setNewTodoTitle] = useState<string>('');
//     const [filteredTodo, setFilteredTodo] = useState<Todo[]>([]);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//
//     const [tempTodo, setTempTodo] = useState<ITempTodo>({
//         isLoading: false,
//         todo: { id: 0, title: '', completed: false },
//     });
//     const inputRef = useRef<HTMLInputElement>(null);
//
//     useEffect(() => {
//         setIsLoading(true);
//         getTodos()
//             .then(setTodos)
//             .catch(() => setError('load'))
//             .finally(() => setIsLoading(false));
//     }, []);
//
//     useEffect(() => {
//         setFilteredTodo(todoFilter(todos, status));
//     }, [todos, status]);
//
//     const handleDeleteTodo = (id: number) => {
//         setIsDeleting(true);
//         deleteTodo(id)
//             .then(() => {
//                 setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
//                 inputRef.current?.focus();
//             })
//             .catch(() => setError('load'))
//             .finally(() => setIsDeleting(false));
//     };
//
//     return (
//         <AppContext.Provider
//             value={{
//                 todos,
//                 filteredTodo,
//                 setTodos,
//                 status,
//                 setStatus,
//                 error,
//                 setError,
//                 tempTodo,
//                 setTempTodo,
//                 inputRef,
//                 newTodoTitle,
//                 setNewTodoTitle,
//                 setFilteredTodo,
//                 handleDeleteTodo,
//                 isDeleting,
//                 setIsDeleting,
//                 isLoading,
//                 setIsLoading
//             }}
//         >
//             {children}
//         </AppContext.Provider>
//     );
// };
