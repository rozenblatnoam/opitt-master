import {createContext, useState, useEffect, useRef} from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios'


export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const loading = useRef(true)
    const [isAuth, setIsAuth] = useState({isAuth: false})
    const [wrongPassword, setwrongPassword] = useState(false)

    const [cookies, setCookie, removeCookie] = useCookies();

    const contextValue = {
        isAuth: isAuth.isAuth,
        wrongPassword: wrongPassword,
        login: async (dataObj) => {
            const loginResult = await axios.post('https://opit2.herokuapp.com/admin/login', dataObj)
            const isAuthServer = loginResult.data.isAuth
            if (isAuthServer) {
                const {cookie} = loginResult.data
                setCookie(cookie[0], cookie[1]);
            }
            setwrongPassword(!isAuthServer)
            setIsAuth({isAuth: isAuthServer})
        },
        logout: () => {
            axios.post('https://opit2.herokuapp.com/admin/logout')
            removeCookie('adminToken', {path:'/'})
            setIsAuth({isAuth: false})
        }
    }

    useEffect( async () => {
        const result = await axios.get('https://opit2.herokuapp.com/admin/checkAuth', { withCredentials: true })
        console.log('result', result)
        console.log('checkAuth', isAuth)
        setIsAuth(result.data)
    }, [])

    useEffect( async () => {
        loading.current = false
    }, [isAuth])

    if (loading.current) return 'LOADING...'

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
