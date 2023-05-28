import { useContext } from 'react'
import styles  from './styles.module.scss'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext, signOut } from '@/src/contexts/AuthContext'

export function Header() {

    const { user } = useContext(AuthContext);

    return(
        <header className={styles.headerContainer} >
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img  src='/logo.svg' width={100} height={100} />
                </Link>

                <nav className={styles.menuNav}>
                    <Link href="/category">
                        <p>Categoria</p>
                    </Link>

                    <Link href="/product">
                        <p>Cardapio</p>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut size={24} />
                    </button>
                </nav>
                
            </div>
        </header>
    )
}