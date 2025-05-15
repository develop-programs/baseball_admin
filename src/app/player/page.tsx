import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {UserPlus, ArrowLeft} from "lucide-react";
import {PlayerInformation} from "@/components/custom/player-info";
import Link from "next/link";

export default function page() {
    return (
        <div className='bg-gray-50 py-8 px-4 md:py-12 md:px-6'>
            <div className="max-w-2xl mx-auto mb-6">
                <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
                </Link>
                
                <Card className="w-full shadow-lg p-0">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-md w-fit">
                                <UserPlus className="h-5 w-5 md:h-6 md:w-6 text-white"/>
                            </div>
                            <div>
                                <CardTitle className="text-xl md:text-2xl font-bold text-indigo-900">Player Registration</CardTitle>
                                <CardDescription className="text-blue-700">Please enter your personal information to register</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <PlayerInformation/>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}