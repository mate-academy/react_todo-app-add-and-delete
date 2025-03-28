export type TodoRemoveHandler = (...ids: number[]) => void;
export type TodoCreateHandler = (title: string) => void;
export type TodoRemoveCompletedHandler = () => void;
