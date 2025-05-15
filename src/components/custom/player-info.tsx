"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import Image from "next/image"

const formSchema = z.object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters long", }),
    fatherName: z.string().min(2, { message: "Father's name must be at least 2 characters long", }),
    motherName: z.string().min(2, { message: "Mother's name must be at least 2 characters long", }),
    dob: z.string().min(2, { message: "Date of birth must be at least 2 characters long", }),
    gender: z.string(),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters long", }),
    addhaar: z.string().min(12, { message: "Aadhaar number must be at least 12 characters long", }),
    email: z.string().email({ message: "Invalid email address", }),
    profileimg: z.string().min(10, { message: "Profile Image Address", }),
    addharImg: z.string().min(10, { message: "Aadhaar Image Address", }),
})

export function PlayerInformation() {
    const [profileImgPreview, setProfileImgPreview] = useState<string | null>(null);
    const [aadhaarImgPreview, setAadhaarImgPreview] = useState<string | null>(null);

    // State for form submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success?: boolean;
        message?: string;
    } | null>(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            fatherName: "",
            motherName: "",
            dob: "",
            gender: "",
            phone: "",
            addhaar: "",
            email: "",
            profileimg: "",
            addharImg: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            setSubmitResult(null);

            // Get location data from session storage
            const locationDataStr = sessionStorage.getItem('playerLocation');
            if (!locationDataStr) {
                setSubmitResult({
                    success: false,
                    message: 'Location information is missing. Please go back and select your location first.'
                });
                return;
            }

            const locationData = JSON.parse(locationDataStr);

            // Combine personal and location data
            const playerData = {
                ...values,
                ...locationData
            };

            // Send data to the API
            const response = await fetch('/api/player/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerData),
            });

            const result = await response.json();

            if (response.ok) {
                // Clear form and session storage on success
                form.reset();
                sessionStorage.removeItem('playerLocation');
                setSubmitResult({
                    success: true,
                    message: 'Registration successful! Your application is now pending approval.'
                });
            } else {
                setSubmitResult({
                    success: false,
                    message: result.message || 'An error occurred during registration.'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setSubmitResult({
                success: false,
                message: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Handle image uploads
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: "profileimg" | "addharImg", setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                form.setValue(fieldName, result);
                setPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Father&apos;s Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter father's name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="motherName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mother&apos;s Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter mother's name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="max-w-full">
                                            <SelectValue placeholder="Select your gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="Enter phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="addhaar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aadhaar Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Aadhaar number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                        control={form.control}
                        name="profileimg"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <div className="grid gap-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, "profileimg", setProfileImgPreview)}
                                        />
                                        {profileImgPreview && (
                                            <div className="mt-2">
                                                <Label>Preview:</Label>
                                                {/* Use standard HTML img tag instead of Next.js Image for data URLs */}
                                                <Image
                                                    src={profileImgPreview}
                                                    alt="Profile Preview"
                                                    className="mt-1 w-24 h-24 object-cover rounded-md"
                                                    width={96}
                                                    height={96}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="addharImg"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Aadhaar Image</FormLabel>
                                <FormControl>
                                    <div className="grid gap-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, "addharImg", setAadhaarImgPreview)}
                                        />
                                        {aadhaarImgPreview && (
                                            <div className="mt-2">
                                                <Label>Preview:</Label>
                                                {/* Use standard HTML img tag instead of Next.js Image for data URLs */}
                                                <Image
                                                    src={aadhaarImgPreview}
                                                    alt="Aadhaar Preview"
                                                    className="mt-1 w-24 h-24 object-cover rounded-md"
                                                    width={96}
                                                    height={96}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-500/80 mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    {!isSubmitting && <ArrowRightCircle className="ml-2" />}
                </Button>

                {submitResult && (
                    <div className={`mt-4 p-4 rounded-md ${submitResult.success ? 'bg-green-50 text-green-800 border border-green-300' :
                        'bg-red-50 text-red-800 border border-red-300'
                        }`}>
                        <p className="font-medium">{submitResult.message}</p>
                        {submitResult.success && (
                            <p className="mt-2">
                                Your registration has been submitted. You will be notified when your application is approved.
                            </p>
                        )}
                    </div>
                )}
            </form>
        </Form>
    )
}
