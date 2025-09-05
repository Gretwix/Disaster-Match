const i = "/IconCont.png";
const im = "/IconDash.png";
const ima = "/IconSet.png";
const imag = "/IconPro.png";
import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"

type User = {
    name: string
    username: string
    password: string
    email: string
    phone: string
    company: string
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<User | null>(null)

    // Simulación de API
    const fetchUser = async () => {
        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/users/1")
            const data = await res.json()
            const userData: User = {
                name: data.name,
                username: data.username,
                password: "*******", // No traer
                email: data.email,
                phone: data.phone,
                company: data.company.name,
            }
            setUser(userData)
            setFormData(userData)
        } catch (error) {
            console.error("Error al obtener el usuario", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleSave = async () => {
        if (!formData) return

        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/users/1", {
                method: "PATCH", // o PUT
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const updated = await res.json()
            setUser(updated)
            setIsEditing(false)
        } catch (error) {
            console.error("Error al actualizar el perfil", error)
        }
    }

    if (loading) return <p className="text-center mt-10">Cargando perfil...</p>

    return (
        <div className="flex mt-8">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen py-2 px-6">
                <nav className="flex flex-col gap-6 font-medium text-xl py-2">
                    <Link className="cursor-pointer flex items-center gap-3 hover:text-blue-600" to="/">
                        <img className="h-4" src={im} alt="alt" />
                        <button className="cursor-pointer">Dashboard</button>
                    </Link>
                    <Link className="cursor-pointer flex items-center gap-3 hover:text-blue-600" to="/">
                        <img className="h-7" src={i} alt="alt" />
                        <button className="cursor-pointer">Contacts</button>
                    </Link>
                    <Link className="cursor-pointer flex items-center gap-3 text-blue-600 font-semibold rounded" to="/Profile">
                        <img className="h-4" src={imag} alt="alt" />
                        <button className="cursor-pointer">Profile</button>
                    </Link>
                    <Link className="cursor-pointer flex items-center gap-3 hover:text-blue-600" to="/">
                        <img className="h-5" src={ima} alt="alt" />
                        <button className="cursor-pointer">Settings</button>
                    </Link>
                </nav>
            </aside>

            {/* Profile Section */}
            <main className="flex-1 px-10">
                <h2 className="flex text-3xl font-bold mb-6">Profile</h2>

                {user && (
                    <div className="bg-gray-50 rounded-lg shadow p-6 max-w-lg text-left">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{user.name}</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false)
                                            setFormData(user)
                                        }}
                                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Edit Section */}
                        {!isEditing ? (
                            <>
                                <p className="grid grid-cols-2 mb-2"><strong>Username:</strong> {user.username}</p>
                                <p className="grid grid-cols-2 mb-2"><strong>Password:</strong> {user.password}</p>
                                <p className="grid grid-cols-2 mb-2"><strong>Email:</strong> {user.email}</p>
                                <p className="grid grid-cols-2 mb-2"><strong>Phone:</strong> {user.phone}</p>
                                <p className="grid grid-cols-2 mb-2"><strong>Company:</strong> {user.company}</p>
                            </>
                        ) : (
                            <form className="grid gap-3">
                                <input name="name" value={formData?.name || ""} onChange={handleChange} className="border p-2 rounded" />
                                <input name="username" value={formData?.username || ""} onChange={handleChange} className="border p-2 rounded" />
                                <input name="password" value={formData?.password || ""} onChange={handleChange} className="border p-2 rounded" />
                                <input name="email" value={formData?.email || ""} onChange={handleChange} className="border p-2 rounded" />
                                <input name="phone" value={formData?.phone || ""} onChange={handleChange} className="border p-2 rounded" />
                                <input name="company" value={formData?.company || ""} onChange={handleChange} className="border p-2 rounded" />
                            </form>
                        )}
                    </div>
                )}

                {/* Purchased Contacts */}
                <section className="mt-10">
                    <h2 className="flex text-3xl font-bold mb-6">Purchased Contacts</h2>
                    <div className="bg-gray-50 rounded-lg shadow p-6 max-w-lg">
                        <p className="flex mb-4">Buy contacts to add to your list</p>
                        <Link to="/">
                            <button className="flex px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Buy Contacts
                            </button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Profile
