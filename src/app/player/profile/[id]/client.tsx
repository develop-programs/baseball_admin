"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PlayerProfileClientProps {
    id: string
}

interface PlayerData {
    fullName: string;
    fatherName: string;
    motherName: string;
    dob: string;
    gender: string;
    phone: string;
    addhaar: string;
    email: string;
    profileimg: string;
    region: string;
    state: string;
    district: string;
    status: string;
    registrationDate: string;
}

export default function PlayerProfileClient({ id }: PlayerProfileClientProps) {
    const [player, setPlayer] = useState<PlayerData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await fetch(`/api/player/profile/${id}`)
                const data = await response.json()

                if (data.success) {
                    setPlayer(data.player)
                } else {
                    setError(data.message || 'Failed to fetch player data')
                }
            } catch (err) {
                setError('An error occurred while fetching player data')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPlayerData()
    }, [id])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-50'
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-50'
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-50'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">Loading player profile...</div>
            </div>
        )
    }

    if (error || !player) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                    <p className="mb-4">{error || 'Player not found'}</p>
                    <Button onClick={() => router.push('/')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Button variant="outline" onClick={() => router.push('/')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </div>

                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold text-indigo-900">Player Profile</CardTitle>
                                <CardDescription className="text-blue-700">
                                    Registration ID: {id}
                                </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(player.status)} capitalize text-sm px-3 py-1`}>
                                {player.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 divide-y divide-gray-200">
                        <div className="flex flex-col md:flex-row gap-6 py-4">
                            <div className="md:w-1/3 flex justify-center">
                                {player.profileimg && (
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md">
                                        <Image
                                            src={player.profileimg}
                                            alt={player.fullName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="md:w-2/3 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{player.fullName}</h2>
                                    <p className="text-gray-500">Registered on {new Date(player.registrationDate).toLocaleDateString()}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Father's Name</p>
                                        <p className="font-medium">{player.fatherName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Mother's Name</p>
                                        <p className="font-medium">{player.motherName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        <p className="font-medium">{player.dob}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p className="font-medium capitalize">{player.gender}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="py-4">
                            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{player.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium">{player.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Aadhar Number</p>
                                    <p className="font-medium">{player.addhaar}</p>
                                </div>
                            </div>
                        </div>

                        <div className="py-4">
                            <h3 className="text-lg font-semibold mb-4">Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Region</p>
                                    <p className="font-medium">{player.region}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">State</p>
                                    <p className="font-medium">{player.state}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">District</p>
                                    <p className="font-medium">{player.district}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}