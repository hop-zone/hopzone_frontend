import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import {
  Auth,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth'
import { createLogicalWrapper } from 'src/utils/logicalWrapper'
import { useRouter } from 'next/router'
import { io, Socket } from 'socket.io-client'

export enum FirebaseError {
  wrongPassword = 'auth/wrong-password',
  userNotFound = 'auth/user-not-found',
  tooManyRequests = 'auth/too-many-requests',
  weakPassword = 'auth/weak-password',
}

interface IAuthContext {
  user: User | null
  socket: Socket | undefined
  restoreAuth: () => Promise<{ state: User; token: string }>
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<LoginResponse>
  login: (email: string, password: string) => Promise<LoginResponse>
  signInAsGuest: () => Promise<LoginResponse>
  logout: () => Promise<Boolean>
  signedIn: boolean
  loaded: boolean
}

export interface LoginResponse {
  success: boolean
  errCode?: string
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FB_APPID,
}

export function useAuth() {
  return useContext(AuthContext)
}

export const Authenticated = createLogicalWrapper(
  AuthContext,
  (ctx: any) => ctx.signedIn,
)

export const NotAuthenticated = createLogicalWrapper(
  AuthContext,
  (ctx: any) => !ctx.signedIn,
)

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket>()
  const [loaded, setLoaded] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  const router = useRouter()
  const app: FirebaseApp = initializeApp(firebaseConfig)
  const auth: Auth = getAuth()
  setPersistence(auth, browserLocalPersistence)

  useEffect(() => {
    let mounted = true

    // console.log(auth.currentUser);

    restoreAuth().then(data => {
      if (mounted) {
        createWebSocket(data.token)
        setUser(data.state)
        setSignedIn(true)
      }
    })
    setLoaded(true)
    return () => {
      mounted = false
    }
  }, [])

  const createWebSocket = (token: string) => {
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: `Bearer ${token}`,
      },
    })

    newSocket.on('connect_error', data => {
      console.log(data)
    })

    setSocket(newSocket)

    console.log('creating new socket connection')
  }

  const signInAsGuest = (): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      try {
        signInAnonymously(auth)
          .then(async userCredential => {
            createWebSocket(await userCredential.user.getIdToken())
            setUser(userCredential.user)
            setSignedIn(true)
            resolve({ success: true })
          })
          .catch(e => {
            reject({ succes: false })
          })
      } catch (error) {
        reject
      }
    })
  }

  const restoreAuth = (): Promise<{ state: User; token: string }> => {
    return new Promise((resolve, reject) => {
      try {
        auth.onAuthStateChanged(async state => {
          if (state) {
            const token = await state.getIdToken()
            resolve({ state, token })
          } else {
            if (router.pathname != '/login' && router.pathname != '/register') {
              router.push('/login')
            }
            reject
          }
        })
      } catch (error) {
        reject
      }
    })
  }

  const register = async (
    email: string,
    password: string,
    username: string,
  ): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      try {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async userCredential => {
            changeUserDisplayName(username, userCredential.user)
            setUser({ ...userCredential.user, displayName: username })
            resolve({ success: true })
          })
          .catch(error => {
            const errorCode = error.code

            reject({ success: false, errCode: errorCode })
          })
      } catch (e) {
        reject
      }
    })
  }

  const changeUserDisplayName = (
    username: string,
    user: User,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      updateProfile(user, {
        displayName: username,
      })
        .then(value => {
          resolve(true)
        })
        .catch(e => {
          console.log('Unable to update username: ', e)
          reject(false)
        })
    })
  }

  const login = (email: string, password: string): Promise<LoginResponse> => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          createWebSocket(await userCredential.user.getIdToken())
          setUser(userCredential.user)
          setSignedIn(true)
          resolve({ success: true })
        })
        .catch(error => {
          const errorCode = error.code
          reject({ success: false, errCode: errorCode })
        })
    })
  }

  const logout = (): Promise<Boolean> => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          socket?.disconnect()
          setUser(null)
          setSignedIn(false)
          resolve(true)
        })
        .catch(e => {
          reject(false)
        })
    })
  }

  const value = {
    user,
    restoreAuth,
    register,
    login,
    loaded,
    logout,
    signedIn,
    signInAsGuest,
    socket,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
