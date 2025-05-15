"use client"
import React from 'react'
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from 'next-auth/react'
export default function LogOutButton() {
    return (
        <form action="/api/auth/signout" method="post">
            <Button variant="outline" size="sm" className="h-9" onClick={() => {
                signOut()
            }}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
            </Button>
        </form>
    )
}
