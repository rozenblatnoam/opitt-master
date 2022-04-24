import './App.css';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Properties from './components/Properties'
import Users from './components/Users'
import MainView from './components/MainView'
import PropertySingle from './components/PropertySingle'
import UserSingle from './components/UserSingle'
import ProtectedRoute from './components/ProtectedRoute'
import {Routes, Route} from 'react-router-dom'
import Cars from './components/Cars'

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<MainView />} />
            <Route path="properties" element={<Properties />} />
            <Route path="users" element={<Users />} />
            <Route path="cars/:carId" element={<Cars />} />
            <Route path="properties/:propertyId" element={<PropertySingle />} />
            <Route path="users/:userId" element={<UserSingle />} />
          </Route>
        </Route>
        <Route path="*" element={<h1>PAGE NOT FOUNT - 404 :(</h1>} />
      </Routes>
    </>
  );
}

export default App;
