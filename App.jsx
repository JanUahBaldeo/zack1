import { useState } from 'react'
import { Header } from './components/Header.jsx'
import { LODashboard } from './components/dashboards/LODashboard.jsx'
import { LOADashboard } from './components/dashboards/LOADashboard.jsx'
import { ProductionPartnerDashboard } from './components/dashboards/ProductionPartnerDashboard.jsx'
import { Button } from './components/ui/button'

export default function App() {
  const [currentRole, setCurrentRole] = useState('Production Partner')
  
  // Mock user with multiple role permissions
  const user = {
    id: '1',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@company.com',
    primaryRole: 'Production Partner',
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
        return <ProductionPartnerDashboard />
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