import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from '../Button/styles.module.scss'

import { FaSpinner } from 'react-icons/fa'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    children: ReactNode,
}

export function Button({ loading, children, ...rest }: ButtonProps) {
    return (
        <button
            className={styles.button}
            disabled={loading}
            {...rest}
        >
            {
                loading ? (
                    <FaSpinner size={16} color='#fff' />
                ) :
                    (
                        <a className={styles.buttonText}>
                            {children}
                        </a>
                    )
            }
        </button>
    )
}