import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { Separator } from './ui/separator.jsx'
import { 
  Home, 
  Users, 
  BarChart3, 
  Calendar, 
  CheckSquare,
  MessageSquare,
  Settings,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react'

export function Sidebar({ user, currentRole, onRoleChange }) {
  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '#' },
    { icon: CheckSquare, label: 'Tasks', href: '#' },
    { icon: Calendar, label: 'Calendar', href: '#' },
    { icon: Users, label: 'Pipeline', href: '#' },
    { icon: BarChart3, label: 'Analytics', href: '#' },
    { icon: MessageSquare, label: 'Communications', href: '#' },
  ]

  const externalTools = [
    { label: 'Mortgage Coach', href: '#' },
    { label: 'MBS Highway', href: '#' },
    { label: 'ChatGPT', href: '#' },
    { label: 'LendingPrice', href: '#' },
    { label: 'Arive', href: '#' },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-sidebar-foreground">
            Mortgage CRM
          </h2>
          <p className="text-sidebar-foreground/70 text-sm">
            Dashboard System
          </p>
        </div>
        
        {/* Role Switcher */}
        <div className="mb-6">
          <p className="text-sidebar-foreground/70 text-sm mb-2">Switch Role</p>
          <div className="space-y-1">
            {user.permissions.map((role) => (
              <Button
                key={role}
                variant={currentRole === role ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => onRoleChange(role)}
              >
                {role}
                {user.primaryRole === role && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Primary
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-sidebar-foreground/70 text-sm">Quick Actions</p>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70">
            <Phone className="mr-2 h-4 w-4" />
            Call Group
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70">
            <Mail className="mr-2 h-4 w-4" />
            Text Group
          </Button>
        </div>

        <Separator className="my-4" />

        {/* External Tools */}
        <div className="space-y-2">
          <p className="text-sidebar-foreground/70 text-sm">External Tools</p>
          {externalTools.map((tool) => (
            <Button
              key={tool.label}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {tool.label}
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Settings */}
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}