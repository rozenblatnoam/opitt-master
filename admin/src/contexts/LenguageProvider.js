import {useState} from 'react'

const LenguageProvider = ({children}) => {
    const [direction, setDirection] = useState('rtl')
    return (
        <div dir={direction}>
            {children}
        </div>
    )
}

export default LenguageProvider
