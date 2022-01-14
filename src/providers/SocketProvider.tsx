import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import { useAuth } from './AuthProvider'

export enum SocketMessages {
  activeRooms = 'b2f_gamerooms',
  currentLobby = 'b2f_lobby',
  getCurrentLobby = 'f2b_lobby',
}

interface ISocketContext {
  activeLobbies: GameRoom[] | undefined
  getLobby: (lobbyId: number) => Promise<boolean>
}

const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const useSockets = () => {
  return useContext(SocketContext)
}

export const SocketProvider: FunctionComponent = ({ children }) => {
  const { socket } = useAuth()
  const [activeLobbies, setActiveLobbies] = useState<GameRoom[]>()
  const [currentLobby, setCurrentLobby] = useState<GameRoom>()

  useEffect(() => {
    if (socket) {
      socket.on(SocketMessages.activeRooms, (data: GameRoom[]) => {
        setActiveLobbies(data)
      })
    }
  }, [socket])

  const getLobby = async (lobbyId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if(socket){
            socket.emit(SocketMessages.getCurrentLobby, lobbyId)
        } else {
            reject
        }
    })
  }

  const value = {
    activeLobbies: activeLobbies,
    getLobby,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
