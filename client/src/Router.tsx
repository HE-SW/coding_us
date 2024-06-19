import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Join from './pages/Join';
import CodingUs from './pages/CodingUs';
import CreateRoom from './pages/CreateRoom';
import Room from './pages/Room';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Join />,
    },
    {
        path: 'coding-us',
        element: <CodingUs />,
    },
    {
        path: 'room',
        element: <CreateRoom />,
        children: [],
    },
    {
        path: 'room/:roomId',
        element: <Room />,
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
