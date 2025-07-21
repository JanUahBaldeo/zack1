import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { TaskWidget } from '../widgets/TaskWidget.jsx'
import { PipelineWidget } from '../widgets/PipelineWidget.jsx'
import { DocumentWidget } from '../widgets/DocumentWidget.jsx'
import { DeadlineWidget } from '../widgets/DeadlineWidget.jsx'
import { QuickStatsWidget } from '../widgets/QuickStatsWidget.jsx'
import { NotificationWidget } from '../widgets/NotificationWidget.jsx'

export function LOADashboard() {
  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatsWidget 
          title="Files in Process"
          value="18"
          change="3 due this week"
          trend="neutral"
        />
        <QuickStatsWidget 
          title="Pending Docs"
          value="27"
          change="5 overdue"
          trend="down"
        />
        <QuickStatsWidget 
          title="Avg Processing Time"
          value="16 days"
          change="-2 days from last month"
          trend="up"
        />
        <QuickStatsWidget 
          title="Files On Schedule"
          value="94%"
          change="+3% from last month"
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks (Priority) */}
        <div className="lg:col-span-1">
          <TaskWidget role="LOA" />
        </div>

        {/* Middle Column - Pipeline */}
        <div className="lg:col-span-1">
          <PipelineWidget role="LOA" />
        </div>

        {/* Right Column - Deadlines */}
        <div className="lg:col-span-1">
          <DeadlineWidget />
        </div>
      </div>

      {/* Bottom Row - Documents & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentWidget />
        <NotificationWidget />
      </div>
    </div>
  )
}