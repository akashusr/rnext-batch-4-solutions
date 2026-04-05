import Board from "./components/Board";
import Header from "./components/Header";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import TasksContextProvider from "./providers/TasksContextProvider";

export default function App() {
    return (
        <>
            <Sidebar />
            <Main>
                <TasksContextProvider>
                    <Header />
                    <Board />
                </TasksContextProvider>
            </Main>
        </>
    );
}
