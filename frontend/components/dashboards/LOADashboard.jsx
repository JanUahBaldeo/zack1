import { PipelineWidget } from '../widgets/PipelineWidget'
import { TaskWidget } from '../widgets/TaskWidget'
import { CalendarWidget } from '../widgets/CalendarWidget'
import { NotificationWidget } from '../widgets/NotificationWidget'
import { DocumentWidget } from '../widgets/DocumentWidget'
import { CampaignWidget } from '../widgets/CampaignWidget'
import { CommunicationWidget } from '../widgets/CommunicationWidget'

export function LOADashboard({ token, role }) {
  return (
    <div className="space-y-6">
      {/* Pipeline Section */}
      <PipelineWidget token={token} role={role} />

      {/* Tasks Section */}
      <TaskWidget token={token} role={role} />

      {/* Calendar Section */}
      <CalendarWidget token={token} role={role} />

      {/* Notifications */}
      <NotificationWidget token={token} />

      {/* Documents */}
      <DocumentWidget token={token} />

      {/* Campaigns */}
      <CampaignWidget token={token} />

      {/* Communications */}
      <CommunicationWidget token={token} />
    </div>
  )
}