import PlayerProfileClient from './client'

// Next.js App Router pages need to export a default component function
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <PlayerProfileClient id={id} />
}
