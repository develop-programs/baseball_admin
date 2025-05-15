"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [aadharNumber, setAadharNumber] = useState<string>("")
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!aadharNumber || aadharNumber.length !== 12) {
      alert("Please enter a valid 12-digit Aadhar number")
      return
    }
    
    setIsSearching(true)
    try {
      const response = await fetch(`/api/player/search?aadhar=${aadharNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      const data = await response.json()
      
      if (data.success && data.player) {
        router.push(`/player/profile/${data.player.id}`) 
      } else {
        alert("No profile found with this Aadhar number.")
      }
    } catch (error) {
      console.error("Search error:", error)
      alert("Error searching for profile. Please try again later.")
    } finally {
      setIsSearching(false)
    }
  }
  
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold text-white">
              RAIPUR NETBALL ASSOCIATION
            </Link>
            <button className="md:hidden text-white">
              {/* Mobile menu button could go here if needed */}
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
            <Input
              type="text"
              placeholder="Search by Aadhar Number"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className="max-w-sm bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 border-white/20 focus-visible:ring-white"
            />
            <Button 
              type="submit" 
              variant="outline" 
              disabled={isSearching} 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
