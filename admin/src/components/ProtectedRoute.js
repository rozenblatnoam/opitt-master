import {useContext} from 'react'
import {Outlet, Navigate} from 'react-router-dom'
import {AuthContext} from '../contexts/AuthProvider'

const ProtectedRoute = () => {
    const {isAuth} = useContext(AuthContext)
    return (
        <div>
            {isAuth ? <Outlet /> : <Navigate to="login" replace={true} />}
        </div>
    )
}

export default ProtectedRoute
