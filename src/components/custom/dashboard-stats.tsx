"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface DashboardStatsProps {
  className?: string;
}

interface DashboardStats {
  totalPlayers: number;
  pendingPlayers: number;
  approvedPlayers: number;
  rejectedPlayers: number;
  recentRegistrations: {
    id: string;
    fullName: string;
    email: string;
    status: string;
    registrationDate: string;
  }[];
}

export function DashboardStats({ className }: DashboardStatsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/info');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.message || "Failed to load dashboard statistics");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="h-4 bg-gray-200 rounded w-1/2"></CardTitle>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-800">Error</CardTitle>
          <CardDescription className="text-red-600">
            {error || "Failed to load dashboard statistics"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <CardDescription>All registered players</CardDescription>
            </div>
            <Users className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <CardDescription>Awaiting review</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPlayers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CardDescription>Registration confirmed</CardDescription>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedPlayers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <CardDescription>Not approved</CardDescription>
            </div>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejectedPlayers}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Registrations</CardTitle>
          <CardDescription>Latest player registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentRegistrations.length === 0 ? (
            <p className="text-sm text-gray-500">No recent registrations</p>
          ) : (
            <div className="space-y-4">
              {stats.recentRegistrations.map((player) => (
                <div key={player.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full h-8 w-8 bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {player.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{player.fullName}</p>
                      <p className="text-xs text-gray-500">{player.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1">
                      {player.status === "approved" && <span className="h-2 w-2 rounded-full bg-green-500" />}
                      {player.status === "pending" && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                      {player.status === "rejected" && <span className="h-2 w-2 rounded-full bg-red-500" />}
                      <span className="text-xs capitalize">{player.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(player.registrationDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
