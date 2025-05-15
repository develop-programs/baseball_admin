"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";

interface Player {
    id: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    dob: string;
    gender: string;
    phone: string;
    addhaar: string;
    email: string;
    profileimg: string;
    addharImg: string;
    region: string;
    state: string;
    district: string;
    status: string;
    registrationDate: string;
}

export default function PlayerDetails({ params }: { params: string }) {
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    // Fetch player details
    useEffect(() => {
        async function fetchPlayerDetails() {
            try {
                const response = await fetch(`/api/admin/players/${params}`);

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/auth/signin?callbackUrl=/admin");
                        return;
                    }
                    if (response.status === 403) {
                        setError("You do not have permission to view this player's details");
                        return;
                    }
                    throw new Error(`Failed to fetch player details: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.success) {
                    setPlayer(data.player);
                } else {
                    setError(data.message || "Failed to load player details");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchPlayerDetails();
    }, [params, router]);

    // Handle status update
    async function updateStatus(status: string) {
        try {
            setUpdating(true);
            const response = await fetch(`/api/admin/players/${params}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/auth/signin?callbackUrl=/admin/players/" + params);
                    return;
                }
                if (response.status === 403) {
                    throw new Error("You do not have permission to update this player's status");
                }
                throw new Error(`Failed to update status: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success) {
                // Update the player state to reflect the new status
                setPlayer(prev => prev ? { ...prev, status } : null);
            } else {
                throw new Error(data.message || "Failed to update player status");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-500">Loading player information...</div>
                </div>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                        <CardTitle className="text-red-800">Error</CardTitle>
                        <CardDescription className="text-red-600">
                            {error || "Failed to load player information"}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="bg-red-50">
                        <Button onClick={() => router.push("/admin")}>Return to Dashboard</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Button
                variant="outline"
                className="mb-6"
                onClick={() => router.push("/admin")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Player Profile</CardTitle>
                            <CardDescription>Personal information and status</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            {player.profileimg ? (
                                <div className="relative w-full max-w-[200px] aspect-square mb-4">
                                    <img
                                        src={player.profileimg}
                                        alt={`${player.fullName}'s profile`}
                                        className="rounded-full object-cover w-full h-full border-4 border-blue-100"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                    <span className="text-4xl font-bold text-blue-500">
                                        {player.fullName.charAt(0)}
                                    </span>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-center">{player.fullName}</h2>
                            <p className="text-gray-500 text-center mb-2">{player.email}</p>
                            <p className="text-gray-500 text-center">{player.phone}</p>

                            <div className="mt-4">
                                <Badge
                                    variant={
                                        player.status === "approved"
                                            ? "success"
                                            : player.status === "rejected"
                                                ? "destructive"
                                                : "outline"
                                    }
                                    className="text-sm py-1 px-3"
                                >
                                    {player.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                                    {player.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                                    {player.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                                    {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="mt-6 text-sm text-gray-500">
                                <p>Registered on {format(new Date(player.registrationDate), "MMMM d, yyyy")}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {player.status === "pending" && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => updateStatus("approved")}
                                        disabled={updating}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve Registration
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => updateStatus("rejected")}
                                        disabled={updating}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject Registration
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">Father&apos;s Name</h3>
                                    <p className="text-lg">{player.fatherName}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">Mother&apos;s Name</h3>
                                    <p className="text-lg">{player.motherName}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">Date of Birth</h3>
                                    <p className="text-lg">{player.dob}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">Gender</h3>
                                    <p className="text-lg capitalize">{player.gender}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">Aadhaar Number</h3>
                                    <p className="text-lg">{player.addhaar}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">Region</h3>
                                    <p className="text-lg">{player.region}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">State</h3>
                                    <p className="text-lg">{player.state}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500">District</h3>
                                    <p className="text-lg">{player.district}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
