import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSockets } from 'src/providers/SocketProvider'

const useLeaveLobbyPrompt = (lobbyId: number) => {
  const message = 'Do you want to haha?'
  const router = useRouter()
  const { leaveLobby } = useSockets()

  const [changed, setChanged] = useState(false)
  const [nextRoute, setNextRoute] = useState<{
    nextRoute: string | undefined
    confirmed: boolean
  }>({
    nextRoute: undefined,
    confirmed: false,
  })

  const toNextRoute = () => {
    setNextRoute({ ...nextRoute, confirmed: true })
  }

  const stayHere = () => {
    setNextRoute({ nextRoute: undefined, confirmed: false })
  }
  useEffect(() => {
    const onRouteChangeStart = (route: string) => {
      if (!confirm(message)) return undefined

      setNextRoute({ nextRoute: route, confirmed: true })
      router.events.emit('routeChangeError')
      throw 'routeChange aborted. Please ignore this error'
    }

    const cleanUpFunction = () =>
      router.events.off('routeChangeStart', onRouteChangeStart)

    const leave = async (redirect: string) => {
        
      const res = await leaveLobby(lobbyId)
      
      console.log(res);
      
      router.push(redirect)
    }

    if (nextRoute.nextRoute && nextRoute.confirmed && lobbyId) {
      leave(nextRoute.nextRoute)

      return cleanUpFunction
    }

    router.events.on('routeChangeStart', onRouteChangeStart)

    return cleanUpFunction
  }, [nextRoute, lobbyId])
}

export default useLeaveLobbyPrompt
