import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow px-6 py-4 flex justify-between">
                <span className="font-bold text-xl">Dropz</span>
                <Link href="/" className="text-sm text-gray-600">Logout</Link>
            </nav>
            {children}
        </div>
    );
}
