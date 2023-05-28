import { useState, FormEvent } from 'react';
import { Header } from "@/src/components/Header"
import Head from "next/head"
import styles from './styles.module.scss'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify';

import { canSSRAuth } from '../../utils/canSSRAuth'
 
export default function Category() {
    const [name, setName] = useState('')

    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        if (name === '') {
            return;
        }

        const apiClient = setupAPIClient();
        await apiClient.post('/category', {
            name: name
        })

        toast.success('Categaoria cadastrada com sucesso!')
        setName('');
    }

    return (
        <>
            <Head>
                <title>Nova categoria - Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar categoria</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Digite o nome do cardapio"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className={styles.buttonAdd} type="submit">
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {

        }
    }
})