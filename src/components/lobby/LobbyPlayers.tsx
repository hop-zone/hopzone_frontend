import React, { FunctionComponent } from 'react'
import { MdPerson } from 'react-icons/md'
import { Player } from 'src/models/player'
import Card from '../card'

interface LobbyPlayerProps {
  players: Player[]
}

const LobbyPlayers: FunctionComponent<LobbyPlayerProps> = ({ players }) => {
  return (
    <div>
      <h2 className=" text-3xl text-theme-orange font-semibold mb-8">
        Players waiting
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {players.map(p => {
          return (
            <Card key={p.displayName} className=" p-5 flex justify-between items-center text-2xl">
              <p>{p.displayName}</p>
              <MdPerson size={24}/>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default LobbyPlayers
