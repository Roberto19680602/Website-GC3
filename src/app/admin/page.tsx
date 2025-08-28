import Link from 'next/link';
import { Settings, Navigation, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <>
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                  Site Settings
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-xs text-muted-foreground">
                  Manage global site configurations like colors, branding, and contact info.
              </div>
              <Button asChild size="sm" className="mt-4">
                  <Link href="/admin/settings">Manage Settings</Link>
              </Button>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                  Navigation Menu
              </CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-xs text-muted-foreground">
                  Control the website's main navigation links and dropdowns.
              </div>
               <Button asChild size="sm" className="mt-4">
                  <Link href="/admin/navigation">Manage Navigation</Link>
              </Button>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Content Blocks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-xs text-muted-foreground">
                  Edit the content on various pages of the site.
              </div>
               <Button asChild size="sm" className="mt-4">
                  <Link href="/admin/content">Manage Content</Link>
              </Button>
              </CardContent>
          </Card>
      </div>
    </>
  )
}
