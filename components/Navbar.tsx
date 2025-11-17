"use client"

import { LogOut, Plus } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


export function NavBar() {
    const { data: session } = useSession()
    const router = useRouter()

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    if (session?.user) {
        return (
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Welcome, {session.user.name} <span className="text-blue-600">({session.user.email})</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/admin/create')}
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus className="w-5 h-5" />
                                Create New QR
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Astron QR Generator
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                    >
                        Create Account
                    </a>
                    <a
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Admin Login
                    </a>
                </div>
            </div>
        </header>
    )
}