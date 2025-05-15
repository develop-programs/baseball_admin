import { Player, columns } from "./column"
import { DataTable } from "./data-table"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardStats } from "@/components/custom/dashboard-stats"
import LogOutButton from "@/components/custom/LogOut"


async function getData(): Promise<Player[]> {
    // Fetch data from your API
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/players`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error('Failed to fetch player data');
        }

        const data = await response.json();
        return data.players;

    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}

export default async function AdminPage() {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    // Redirect to login if not authenticated
    if (!session || !session.user) {
        redirect("/auth/signin?callbackUrl=/admin");
    }

    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
        redirect("/auth/signin?callbackUrl=/admin")
    }

    const data = await getData();

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        Logged in as <span className="font-medium">{session.user?.name}</span>
                    </div>
                    <LogOutButton />
                </div>
            </div>

            {/* Stats Dashboard */}
            <DashboardStats className="mb-8" />

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Player Registrations</h2>
                <p className="text-gray-500">Manage all registered players</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}
