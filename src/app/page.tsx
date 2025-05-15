import {PlayerRegistration} from "@/components/custom/player-registration";
import {MapPin, UserCheck, Info} from "lucide-react";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";

export default function page() {
    return (
        <div className="bg-gray-50 py-8 px-4 md:py-12 md:px-6">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                        Welcome to Raipur Netball Association
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join the growing community of netball players in Raipur. Register today to participate in competitions and training programs.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <UserCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Player Registration</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Register as a player to join our association and participate in events.</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-indigo-100 p-2 rounded-full">
                                    <Info className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Check Status</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Search for your profile using your Aadhar number to check registration status.</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-md md:col-span-2 lg:col-span-1">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Location Selection</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Select your location to get started with the registration process.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {/* Registration Card */}
            <div className="max-w-xl mx-auto">
                <Card className="w-full shadow-lg p-0">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full shadow-md">
                                <MapPin className="h-6 w-6 text-white"/>
                            </div>
                            <div>
                                <CardTitle className="text-xl md:text-2xl font-bold text-indigo-900">Select Your Location</CardTitle>
                                <CardDescription className="text-blue-700">Please select your region, state, and district to
                                    continue</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <PlayerRegistration/>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}