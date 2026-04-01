// components/RegistryLoginForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signinRegistry } from "@/core/auth-action"; // Adjust path

export function RegistryLoginForm() {
    const [regNo, setRegNo] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signinRegistry(regNo, birthDate);
        if (result.error) setError(result.error);
        else {
            console.log("User Found:", result.user);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
                <Label htmlFor="regNo">Registry ID</Label>
                <Input
                    id="regNo"
                    placeholder="123456789"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="birthDate">Birthdate (YYYY-MM-DD)</Label>
                <Input
                    id="birthDate"
                    placeholder="YYYY-MM-DD"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Checking Registry..." : "Login"}
            </Button>
        </form>
    );
}