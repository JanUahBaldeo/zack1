import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Progress } from '../ui/progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell
} from 'recharts'
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  ChevronDown,
  Filter,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useState } from 'react'

export function ProductionPartnerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days')
  const [selectedChannel, setSelectedChannel] = useState('Email')
  const [selectedProduct, setSelectedProduct] = useState('CTR by Product Partner')

  // Lead Generation Data
  const leadGenerationData = [
    {
      partner: 'ABC Title Co.',
      leads: 67,
      mqls: 41,
      cpl: '$2.50',
      source: 'Co-branded email',
      status: 'Active'
    },
    {
      partner: 'HomeShield Warranty',
      leads: 82,
      mqls: 52,
      cpl: '$9.10',
      source: 'Paid Meta Ads',
      status: 'Pending'
    },
    {
      partner: 'RateCompare Pro',
      leads: 158,
      mqls: 37,
      cpl: '$15.70',
      source: 'OMB/Web',
      status: 'Active'
    }
  ]

  // Conversion Funnel Data
  const funnelData = [
    { name: 'Clicks', value: 100, fill: '#22D3EE' },
    { name: 'Landing Page Views', value: 85, fill: '#0EA5E9' },
    { name: 'Form Submissions', value: 47, fill: '#0284C7' },
    { name: 'Qualified Leads', value: 25, fill: '#0369A1' },
    { name: 'Booked Appointments', value: 15, fill: '#075985' },
    { name: 'Closed/Won Deals', value: 8, fill: '#0C4A6E' }
  ]

  // Campaign Performance Data
  const campaignData = [
    {
      name: 'ABC Title Co.',
      partner: 67,
      variant: 41,
      ctr: '6.1%',
      leads: 52,
      conversionRate: '14.7%'
    },
    {
      name: 'HomeShield Warranty',
      partner: 82,
      variant: 52,
      ctr: '5.3%',
      leads: 21,
      conversionRate: '9.4%'
    }
  ]

  // CTR Analytics Data
  const ctrData = [
    { name: 'Item 1', value: 8.5, fill: '#0891B2' },
    { name: 'Item 2', value: 12, fill: '#22D3EE' },
    { name: 'Item 3', value: 16, fill: '#FB923C' },
    { name: 'Item 4', value: 19, fill: '#6B7280' }
  ]

  // Integration Status Data
  const integrations = {
    crmSyncs: [
      { name: 'Chili', status: 'CONNECTED', color: 'bg-orange-500' },
      { name: 'HubSpot', status: 'DISCONNECTED', color: 'bg-red-500' },
      { name: 'Salesforce', status: 'SYNCED', color: 'bg-green-500' }
    ],
    emailPlatforms: [
      { name: 'Benchmark', status: 'CONNECTED', color: 'bg-orange-500' },
      { name: 'ActiveCampaign', status: 'DISCONNECTED', color: 'bg-red-500' }
    ],
    adPlatforms: [
      { name: 'Meta', status: 'SYNCED', color: 'bg-orange-500' },
      { name: 'Google', status: 'DISCONNECTED', color: 'bg-red-500' },
      { name: 'LinkedIn', status: 'SYNCED', color: 'bg-green-500' }
    ]
  }

  // Actionable Tasks
  const actionableTasks = [
    {
      title: 'Underperforming partner flagged (CTR < 2%)',
      type: 'warning',
      icon: <ArrowUp className="w-4 h-4" />
    },
    {
      title: 'Campaigns with low conversion needing review',
      type: 'info',
      icon: <ArrowUp className="w-4 h-4" />
    },
    {
      title: 'Suggested tests (CTA, landing page, offer)',
      type: 'suggestion',
      icon: <ArrowUp className="w-4 h-4" />
    },
    {
      title: 'High-performing partners for scaling',
      type: 'success',
      icon: <ChevronDown className="w-4 h-4" />
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>
      case 'CONNECTED':
        return <Badge className="bg-orange-500 text-white text-xs">CONNECTED</Badge>
      case 'DISCONNECTED':
        return <Badge className="bg-red-500 text-white text-xs">DISCONNECTED</Badge>
      case 'SYNCED':
        return <Badge className="bg-green-500 text-white text-xs">SYNCED</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <div>
              <CardTitle>Overview</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                  <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">METRIC</div>
                    <div className="font-semibold">VALUE</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Clicks</span>
                      <span className="font-semibold">3,457</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">CTR (Click-Through Rate)</span>
                      <span className="font-semibold">4.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Leads Generated</span>
                      <span className="font-semibold">287</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Qualified Leads (MQLs)</span>
                      <span className="font-semibold">134</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-semibold">13.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Appointments Booked</span>
                      <span className="font-semibold">68</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Top Performing Partner</span>
                      <span className="font-semibold">XYZ Home Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTR Analytics Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Click-Through Rate (CTR) Analytics</CardTitle>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CTR by Product Partner">CTR by Product Partner</SelectItem>
                  <SelectItem value="CTR by Campaign">CTR by Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ctrData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                <span className="text-sm">Item 1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                <span className="text-sm">Item 2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm">Item 3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm">Item 4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Generation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span>PARTNER</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span>LEADS</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span>MQLS</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span>CPL (COST/LEAD)</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span>SOURCE</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span>STATUS</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {leadGenerationData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">
                      <span className="text-blue-600 underline cursor-pointer">{row.partner}</span>
                    </td>
                    <td className="py-3 px-4">{row.leads}</td>
                    <td className="py-3 px-4">{row.mqls}</td>
                    <td className="py-3 px-4">{row.cpl}</td>
                    <td className="py-3 px-4">{row.source}</td>
                    <td className="py-3 px-4">{getStatusBadge(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Funnel Visualization */}
            <div className="relative">
              <div className="space-y-1">
                {funnelData.map((stage, index) => (
                  <div key={stage.name} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{stage.name}</span>
                        <span className="text-sm font-semibold">{stage.value}%</span>
                      </div>
                      <div 
                        className="h-12 rounded-r-full flex items-center justify-start pl-4"
                        style={{ 
                          backgroundColor: stage.fill, 
                          width: `${stage.value}%`,
                          marginLeft: `${index * 5}%`
                        }}
                      >
                        <span className="text-white text-sm font-medium">{stage.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Funnel Text Details */}
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.name} className="flex justify-between items-center">
                  <span className="text-sm">{stage.name}</span>
                  <span className="font-semibold">{stage.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Tracker and Integration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Tracker / A/B Testing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium">
                  <span>CAMPAIGN NAME</span>
                  <span>PARTNER</span>
                  <span>VARIANT</span>
                  <span>CTR</span>
                  <span>LEADS</span>
                  <span>CONVERSION RATE</span>
                </div>
              </div>
              {campaignData.map((campaign, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 text-sm">
                  <span className="text-blue-600 underline cursor-pointer">{campaign.name}</span>
                  <span>{campaign.partner}</span>
                  <span>{campaign.variant}</span>
                  <span>{campaign.ctr}</span>
                  <span>{campaign.leads}</span>
                  <span>{campaign.conversionRate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CRM Lead Syncs */}
            <div>
              <div className="bg-orange-100 rounded-lg p-2 mb-3">
                <span className="text-sm font-medium">CRM LEAD SYNCS</span>
              </div>
              <div className="space-y-2">
                {integrations.crmSyncs.map((integration, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-blue-600 underline cursor-pointer text-sm">{integration.name}</span>
                    {getStatusBadge(integration.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Email Platforms */}
            <div>
              <div className="bg-orange-100 rounded-lg p-2 mb-3">
                <span className="text-sm font-medium">EMAIL PLATFORMS</span>
              </div>
              <div className="space-y-2">
                {integrations.emailPlatforms.map((integration, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-blue-600 underline cursor-pointer text-sm">{integration.name}</span>
                    {getStatusBadge(integration.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Platforms */}
            <div>
              <div className="bg-orange-100 rounded-lg p-2 mb-3">
                <span className="text-sm font-medium">AD PLATFORMS</span>
              </div>
              <div className="space-y-2">
                {integrations.adPlatforms.map((integration, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-blue-600 underline cursor-pointer text-sm">{integration.name}</span>
                    {getStatusBadge(integration.status)}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Tasks & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Actionable Tasks & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionableTasks.map((task, index) => (
            <div key={index} className="space-y-2">
              <div className={`p-3 rounded-lg flex items-center justify-between ${
                task.type === 'warning' ? 'bg-yellow-100' :
                task.type === 'info' ? 'bg-green-100' :
                task.type === 'suggestion' ? 'bg-orange-100' :
                'bg-blue-100'
              }`}>
                <span className="text-sm">{task.title}</span>
                {task.icon}
              </div>
              {task.type === 'success' && (
                <div className="ml-4 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}