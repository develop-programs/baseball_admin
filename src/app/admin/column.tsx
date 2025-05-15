"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
export type Player = {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  status: "pending" | "approved" | "rejected"
  registrationDate: string
}

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      return (
        <Badge
          variant={
            status === "approved" 
              ? "success" 
              : status === "rejected" 
                ? "destructive" 
                : "outline"
          }
        >
          {status === "approved" 
            ? "Approved" 
            : status === "rejected" 
              ? "Rejected" 
              : "Pending"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "registrationDate",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("registrationDate"))
      return <div>{format(date, "MMM d, yyyy")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const player = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/players/${player.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {player.status === "pending" && (
              <>
                <DropdownMenuItem 
                  onClick={() => updatePlayerStatus(player.id, "approved")}
                  className="text-green-600"
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updatePlayerStatus(player.id, "rejected")}
                  className="text-red-600"
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

async function updatePlayerStatus(playerId: string, status: string) {
  try {
    const response = await fetch(`/api/admin/players/${playerId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update status');
    }
    
    // Reload the page to reflect the changes
    window.location.reload();
  } catch (error) {
    console.error('Error updating player status:', error);
    alert('Failed to update player status. Please try again.');
  }
}
