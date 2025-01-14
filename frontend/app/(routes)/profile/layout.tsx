import Link from "next/link";
import { getUserMeLoader } from "@/services/userService";
import { 
  LayoutDashboard,
  Package,
  BarChart,
  Activity,
  FileText,
  Settings,
  User
} from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    // Obtener usuario y validar rol
    const { data: userData } = await getUserMeLoader();
    const isAdmin = userData?.role?.type === 'admin';

    return (
        <div className="h-screen grid grid-cols-[240px_1fr] overflow-hidden">
            <nav className="border-r bg-transparent">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link
                            className="flex items-center gap-2 font-semibold text-primary"
                            href="/profile"
                        >
                            <User className="h-6 w-6" />
                            <span className="">Perfil</span>
                        </Link>
                    </div>
                    <div className="flex-1 py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {/* Sección de Usuario */}
                            <div className="pb-4">
                                <h2 className="mb-2 px-2 text-lg font-semibold">Usuario</h2>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-gray-900 dark:hover:text-gray-50"
                                    href="/profile/orders"
                                >
                                    <FileText className="h-4 w-4" />
                                    Pedidos
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-gray-900 dark:hover:text-gray-50"
                                    href="/profile/settings"
                                >
                                    <Settings className="h-4 w-4" />
                                    Configuración
                                </Link>
                            </div>

                            {/* Sección de Administración */}
                            {isAdmin && (
                                <div className="pb-4">
                                    <h2 className="mb-2 px-2 text-lg font-semibold">Administración</h2>
                                    <Link
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-gray-900 dark:hover:text-gray-50"
                                        href="/profile/admin/products"
                                    >
                                        <Package className="h-4 w-4" />
                                        Productos
                                    </Link>
                                    <Link
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-gray-900 dark:hover:text-gray-50"
                                        href="/profile/admin/reports"
                                    >
                                        <BarChart className="h-4 w-4" />
                                        Reportes
                                    </Link>
                                    <Link
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-gray-900 dark:hover:text-gray-50"
                                        href="/profile/admin/analytics"
                                    >
                                        <Activity className="h-4 w-4" />
                                        Analíticas
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </nav>
            <main className="flex flex-col h-full overflow-auto">{children}</main>
        </div>
    );
}