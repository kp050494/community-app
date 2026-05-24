"use client"

import { motion } from "motion/react"
import { 
  Users, Home, Calendar, CreditCard, 
  TrendingUp, Activity, Bell, FileText
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Total Members", value: "2,451", trend: "+12% from last month", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Families", value: "532", trend: "+4 new this month", icon: Home, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Upcoming Events", value: "3", trend: "Next: Navratri Mahotsav", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Fee Collected (2025)", value: "₹4.2L", trend: "85% of target", icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
  ]

  const recentActivities = [
    { id: 1, text: "New family registration: Patel Family (Pandesara)", time: "2 hours ago", icon: Users },
    { id: 2, text: "Payment received: Annual Fee 2025 (SKPM-0492)", time: "5 hours ago", icon: CreditCard },
    { id: 3, text: "New notice published: Annual General Meeting", time: "1 day ago", icon: Bell },
    { id: 4, text: "Event registration: 150 members registered for Picnic", time: "2 days ago", icon: Calendar },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening in your community today.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 bg-card border border-border rounded-2xl shadow-sm premium-card relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 text-muted-foreground/30" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold font-heading text-foreground">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-medium text-emerald-500">
                <TrendingUp className="w-3 h-3" />
                <span>{stat.trend}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 p-6 bg-card border border-border rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-heading text-foreground">Recent Activity</h2>
            <button className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity, i) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="relative mt-1">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                    <activity.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  {i !== recentActivities.length - 1 && (
                    <div className="absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-sm font-medium text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="p-6 bg-card border border-border rounded-2xl shadow-sm"
        >
          <h2 className="text-xl font-bold font-heading text-foreground mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Add New Member", icon: Users },
              { label: "Publish Notice", icon: Bell },
              { label: "Create Event", icon: Calendar },
              { label: "Record Payment", icon: CreditCard },
              { label: "Generate Report", icon: FileText },
            ].map((action, i) => (
              <button 
                key={i}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-transparent hover:border-border hover:bg-muted transition-all group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
