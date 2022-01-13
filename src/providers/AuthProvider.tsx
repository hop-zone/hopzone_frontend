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
} from 'firebase/auth'
import { createLogicalWrapper } from 'src/utils/logicalWrapper'

export enum FirebaseError {
  wrongPassword = 'auth/wrong-password',
  userNotFound = 'auth/user-not-found',
  tooManyRequests = 'auth/too-many-requests',
  weakPassword ='auth/weak-password'
}

interface IAuthContext {
  user: User | null
  restoreAuth: () => Promise<{ state: User; token: string }>
  register: (
    email: string,
    password: string,
    username: string,
  ) => Promise<LoginResponse>
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<Boolean>
  signedIn: boolean
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
  const [signedIn, setSignedIn] = useState(false)
  const app: FirebaseApp = initializeApp(firebaseConfig)
  const auth: Auth = getAuth()
  setPersistence(auth, browserLocalPersistence)

  useEffect(() => {
    let mounted = true
    restoreAuth().then(data => {
      if (mounted) {
        setUser(data.state)
        setSignedIn(true)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const restoreAuth = (): Promise<{ state: User; token: string }> => {
    return new Promise((resolve, reject) => {
      try {
        auth.onAuthStateChanged(async state => {
          // console.log(state)
          if (state) {
            const token = await state.getIdToken()
            resolve({ state, token })
          } else {
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
            setUser(userCredential.user)
            console.log(userCredential)
            resolve({ success: true })
          })
          .catch(error => {
            const errorCode = error.code

            reject({ success: false, errCode: errorCode })
          })
        // const url: string = process.env.NEXT_PUBLIC_BACKEND as string
        // fetch(`http://${url.split('/')[2]}/auth/signup`, {
        //   method: 'POST',
        //   headers: { 'content-type': 'application/json' },
        //   body: JSON.stringify({
        //     email: email,
        //     password: password,
        //     name: username,
        //   }),
        // })
        //   .then(async response => {
        //     await login(email, password)
        //       .then(res => {
        //         resolve(true)
        //       })
        //       .catch(e => {
        //         reject
        //       })
        //   })
        //   .catch(e => {
        //     reject
        //   })
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
          console.log(value)

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
          setUser(userCredential.user)
          setSignedIn(true)
          resolve({ success: true })
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(error)

          resolve({ success: false, errCode: errorCode })
        })
    })
  }

  const logout = (): Promise<Boolean> => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
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
    logout,
    signedIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
