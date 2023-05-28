import { createContext, ReactNode, useState, useEffect } from 'react'
import { api } from '../services/apiClient'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

import { toast } from 'react-toastify'


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    singUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch {
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({ id: '', name: '', email: '' });

    useEffect(() => {
        // tentar pega algo no cookie
        const { '@nextauth.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
                .catch(() => {
                    signOut();
                })
        }
    }, [])

    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            })
            // console.log(response.data);

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Expira em 1 mês ou 30 dias;
                path: "/"
            })

            setUser({
                id,
                name,
                email,
            })

            // passar para proxima requisicoes o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!');
            //redirirencionar user para pagina dashboard
            Router.push('/dashboard')

        } catch (error) {
            toast.error('Erro ao acessar')
            console.log("Erro ao acessar", error)
        }
    }

    async function singUp({ name, email, password }: SignUpProps) {
        try {

            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success('Canta criada com sucesso!')

            Router.push('/')

        } catch (error) {
            toast.error('Erro ao cadastrar-se com sucesso!')
            console.log("erro ao cadastrar", error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, singUp }}>
            {children}
        </AuthContext.Provider>
    )
}