import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Users, TrendingUp, Clock, Filter, Eye, MousePointer } from 'lucide-react'

export function LeadAnalyticsWidget() {
  const mockLeadSources = [
    {
      id: '1',
      name: 'Facebook Ads',
      leads: 87,
      qualified: 34,
      cost: 1240,
      conversionRate: 39.1,
      status: 'active',
      timeStale: 2
    },
    {
      id: '2',
      name: 'Google Ads',
      leads: 65,
      qualified: 28,
      cost: 1580,
      cost: 1580,
      conversionRate: 43.1,
      status: 'active',
      timeStale: 1
    },
    {
      id: '3',
      name: 'Referral Program',
      leads: 42,
      qualified: 31,
      cost: 420,
      conversionRate: 73.8,
      status: 'active',
      timeStale: 0
    },
    {
      id: '4',
      name: 'Email Campaign',
      leads: 156,
      qualified: 45,
      cost: 200,
      conversionRate: 28.8,
      status: 'paused',
      timeStale: 5
    }
  ]

  const totalLeads = mockLeadSources.reduce((sum, source) => sum + source.leads, 0)
  const totalQualified = mockLeadSources.reduce((sum, source) => sum + source.qualified, 0)
  const totalCost = mockLeadSources.reduce((sum, source) => sum + source.cost, 0)
  const avgConversionRate = (totalQualified / totalLeads) * 100

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="text-xs">Active</Badge>
      case 'paused':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'ended':
        return <Badge variant="outline" className="text-xs">Ended</Badge>
    }
  }

  const getStaleIndicator = (timeStale) => {
    if (timeStale > 7) return <Badge variant="destructive" className="text-xs">Stale</Badge>
    if (timeStale > 3) return <Badge className="text-xs bg-yellow-100 text-yellow-800">Aging</Badge>
    return <Badge variant="secondary" className="text-xs">Fresh</Badge>
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getCostPerLead = (cost, leads) => {
    return leads > 0 ? formatCurrency(cost / leads) : '$0'
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Lead Analytics</CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <p className="text-lg">{totalLeads}</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-sm text-muted-foreground">Qualified</p>
            <p className="text-lg">{totalQualified}</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Conversion Rate</span>
            <span>{avgConversionRate.toFixed(1)}%</span>
          </div>
          <Progress value={avgConversionRate} className="h-2" />
        </div>

        {/* Lead Sources */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Lead Sources</h4>
          {mockLeadSources.map(source => (
            <div key={source.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{source.name}</span>
                  {getStatusBadge(source.status)}
                </div>
                {getStaleIndicator(source.timeStale)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                <div className="flex items-center justify-between">
                  <span>Leads</span>
                  <span>{source.leads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Qualified</span>
                  <span>{source.qualified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cost</span>
                  <span>{formatCurrency(source.cost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CPL</span>
                  <span>{getCostPerLead(source.cost, source.leads)}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Conversion Rate</span>
                  <span>{source.conversionRate}%</span>
                </div>
                <Progress value={source.conversionRate} className="h-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Metrics */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <MousePointer className="h-3 w-3 text-blue-500" />
                <span>Total Spent</span>
              </span>
              <span>{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-yellow-500" />
                <span>Avg. CPL</span>
              </span>
              <span>{getCostPerLead(totalCost, totalLeads)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}