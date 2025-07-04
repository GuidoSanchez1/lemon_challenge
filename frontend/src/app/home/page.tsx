import LogoutButton from "@/components/LogoutButton";

export default function HomePage() {

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Welcome to Lemon</h1>
            <p className="text-lg">This is the home page.</p>

            <LogoutButton />
        </div>
    );

}