import React from 'react'
import PlayerDetails from './PlayerInfo'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PlayerDetails params={id} />
}
