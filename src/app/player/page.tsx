import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {MapPin} from "lucide-react";
import {PlayerInformation} from "@/components/custom/player-info";

export default function page() {
    return (
        <div className='h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
            <Card className="w-full max-w-2xl shadow-lg p-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                            <MapPin className="h-6 w-6 text-white"/>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-indigo-900">Select Your Location</CardTitle>
                            <CardDescription className="text-blue-700">Please select your region, state, and district to
                                continue</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <PlayerInformation/>
                </CardContent>
            </Card>
        </div>
    )
}