"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  Settings, 
  TrendingUp, 
  Calendar, 
  MessageCircle,
  Plus,
  Edit,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "blog", label: "Blog Management", icon: FileText },
    { id: "services", label: "Services Management", icon: Briefcase },
    { id: "contacts", label: "Contact Management", icon: Users },
    { id: "settings", label: "Website Settings", icon: Settings }
  ];

  const stats = [
    {
      title: "Total Blog Posts",
      value: "6",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Services",
      value: "5", 
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Contact Inquiries",
      value: "12",
      icon: MessageCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Monthly Visitors",
      value: "1,250",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const recentActivities = [
    {
      action: "New blog post published",
      title: "Legal Validity of Oral Agreements",
      time: "2 hours ago",
      icon: FileText
    },
    {
      action: "Contact inquiry received",
      title: "From María García about legal consultation",
      time: "4 hours ago",
      icon: MessageCircle
    },
    {
      action: "Service updated",
      title: "Corporate Law consultation rates modified",
      time: "1 day ago",
      icon: Briefcase
    },
    {
      action: "New blog post published",
      title: "The Evolution of Law with Technology",
      time: "2 days ago",
      icon: FileText
    },
    {
      action: "Website settings updated",
      title: "Footer contact information modified",
      time: "3 days ago",
      icon: Settings
    }
  ];

  const quickActions = [
    { label: "Create New Post", icon: Plus, color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Edit Services", icon: Edit, color: "bg-green-600 hover:bg-green-700" },
    { label: "View Analytics", icon: Eye, color: "bg-purple-600 hover:bg-purple-700" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1E5F99] text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">GC3 Consultoría</h1>
              <span className="text-sm text-blue-200">Admin Dashboard</span>
            </div>
            <div className="text-sm">
              Welcome, Administrator
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                        activeSection === item.id
                          ? "bg-[#1E5F99] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h2>
              <p className="text-gray-600">
                Manage your consulting website content and monitor performance
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Recent Activity
                    </h3>
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="bg-gray-100 p-2 rounded-full">
                            <Icon size={16} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={index}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition-colors duration-200 ${action.color}`}
                        >
                          <Icon size={18} />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Website Status */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Website Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Server Status</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Backup</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SSL Certificate</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Valid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}