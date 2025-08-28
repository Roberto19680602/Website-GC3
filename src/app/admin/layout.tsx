import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Home, Package2, Users, Settings, Navigation, FileText } from 'lucide-react';
import Link from 'next/link';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');

  if (!token) {
    return null;
  }

  const res = await fetch('http://localhost:3000/api/auth/me', {
    headers: {
      Cookie: `authToken=${token.value}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  try {
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Failed to parse user JSON:", error);
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login?from=/admin');
  }

  if (user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">GC3 Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Site Settings
              </Link>
              <Link
                href="/admin/navigation"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Navigation className="h-4 w-4" />
                Navigation
              </Link>
              <Link
                href="/admin/content"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Content Blocks
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Admin Panel</h1>
          </div>
          <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
