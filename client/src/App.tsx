import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Join from './pages/Join';
import CodingUs from './pages/CodingUs';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Join />,
    },
    {
        path: 'coding-us',
        element: <CodingUs />,
    },
]);

function App() {
    return (
        <div className="w-screen h-screen">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
