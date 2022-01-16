import { useEffect } from 'react'
import Router from 'next/router'
import { useAuth } from 'src/providers/AuthProvider'
import { SocketMessages, useSockets } from 'src/providers/SocketProvider'

export const useWarnLeaveLobby = (
  lobbyId: string | string[] | undefined,
) => {
  const message = 'Do you want to leave?'

  const { socket } = useAuth()
  const { leaveLobby } = useSockets()

  useEffect(() => {
    const routeChangeStart = (url: string) => {
      if (Router.asPath !== url && lobbyId && !confirm(message)) {
        Router.events.emit('routeChangeError')
        Router.replace({
          pathname: Router.pathname,
          query: Router.query,
        })

        throw 'Abort route change. Please ignore this error.'
      } else {
        leaveLobby(lobbyId as string)
      }
    }

    const beforeunload = (e: {
      preventDefault: () => void
      returnValue: string
    }) => {
      if (lobbyId) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    // window.addEventListener('beforeunload', beforeunload)
    Router.events.on('routeChangeStart', routeChangeStart)

    return () => {
      window.removeEventListener('beforeunload', beforeunload)
      Router.events.off('routeChangeStart', routeChangeStart)
    }
  }, [lobbyId, socket])
}
