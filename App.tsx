import { useState } from 'react'
import { Header } from './components/Header'
import { LODashboard } from './components/dashboards/LODashboard'
import { LOADashboard } from './components/dashboards/LOADashboard'
import { ProductionPartnerDashboard } from './components/dashboards/ProductionPartnerDashboard'
import { Button } from './components/ui/button'

export type UserRole = 'LO' | 'LOA' | 'Production Partner'

export interface User {
  id: string
  name: string
  email: string
  primaryRole: UserRole
  permissions: UserRole[]
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('LOA')
  
  // Mock user with multiple role permissions
  const user: User = {
    id: '1',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@company.com',
    primaryRole: 'LOA',
    permissions: ['LO', 'LOA', 'Production Partner'] // User can access all dashboards
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case 'LO':
        return <LODashboard />
      case 'LOA':
        return <LOADashboard />
      case 'Production Partner':
        return <ProductionPartnerDashboard />
      default:
        return <LOADashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      {/* Navigation Tabs */}
      <div className="border-b bg-white px-6">
        <div className="flex space-x-1">
          {user.permissions.map((role) => (
            <Button
              key={role}
              variant={currentRole === role ? "default" : "ghost"}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={currentRole === role}
              onClick={() => setCurrentRole(role)}
            >
              {role} Dashboard
            </Button>
          ))}
        </div>
      </div>

      <main className="overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2">
              {currentRole} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Here's your {currentRole.toLowerCase()} overview.
            </p>
          </div>
          {renderDashboard()}
        </div>
      </main>
    </div>
  )
}