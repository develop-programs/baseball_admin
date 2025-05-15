"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Create a separate component for the error content
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    default: "An error occurred during authentication.",
    AccessDenied: "You do not have permission to access this resource.",
    Verification: "The login link is invalid or has expired.",
    CredentialsSignin: "The login credentials are invalid.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-red-50 to-orange-50 rounded-t-xl">
        <div className="flex justify-center mb-2">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-red-800">Authentication Error</CardTitle>
        <CardDescription className="text-red-700">There was a problem signing you in</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-4">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-6">
        <Button asChild>
          <Link href="/auth/signin">Try Again</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main page component with Suspense
export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md shadow-xl p-6 text-center">
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="animate-spin h-8 w-8 border-4 border-red-300 rounded-full border-t-red-600"></div>
            </div>
            <p>Loading error details...</p>
          </CardContent>
        </Card>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
