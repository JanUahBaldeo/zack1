import { PipelineWidget } from '../widgets/PipelineWidget'
import { TaskWidget } from '../widgets/TaskWidget'
import { CalendarWidget } from '../widgets/CalendarWidget'
import { MarketingWidget } from '../widgets/MarketingWidget'
import { PerformanceWidget } from '../widgets/PerformanceWidget'
import { LeadAnalyticsWidget } from '../widgets/LeadAnalyticsWidget'
import { NotificationWidget } from '../widgets/NotificationWidget'
import { DocumentWidget } from '../widgets/DocumentWidget'
import { CampaignWidget } from '../widgets/CampaignWidget'
import { CommunicationWidget } from '../widgets/CommunicationWidget'

export function LODashboard({ token, role }) {
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

      {/* Marketing */}
      <MarketingWidget token={token} />

      {/* Performance */}
      <PerformanceWidget token={token} />

      {/* Lead Analytics */}
      <LeadAnalyticsWidget token={token} />
    </div>
  )
}