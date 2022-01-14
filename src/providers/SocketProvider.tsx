import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import { useAuth } from './AuthProvider'

enum SocketMessages {
  activeRooms = 'b2f_gamerooms',
}

interface ISocketContext {
  activeLobbies: GameRoom[] | undefined
}

const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const useSockets = () => {
  return useContext(SocketContext)
}

export const SocketProvider: FunctionComponent = ({ children }) => {
  const { socket } = useAuth()

  const [activeLobbies, setActiveLobbies] = useState<GameRoom[]>()

  useEffect(() => {
    if (socket) {
      socket.on(SocketMessages.activeRooms, (data: GameRoom[]) => {
        setActiveLobbies(data)
      })
    }
  }, [socket])

  const value = {
    activeLobbies: activeLobbies,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
