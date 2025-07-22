import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Play, Pause, BarChart3, Target, Eye, MousePointer } from 'lucide-react'
import { fetchCampaigns } from './api';

export function CampaignWidget({ token }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCampaigns(token)
      .then(data => {
        setCampaigns(data.campaigns || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load campaigns');
        setLoading(false);
      });
  }, [token]);

  // Remove mockCampaigns, use campaigns from state
  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'email':
        return '📧'
      case 'social':
        return '📱'
      case 'paid-search':
        return '🔍'
      case 'display':
        return '🖥️'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="text-xs">Active</Badge>
      case 'paused':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'completed':
        return <Badge variant="outline" className="text-xs">Completed</Badge>
      case 'scheduled':
        return <Badge className="text-xs bg-blue-100 text-blue-800">Scheduled</Badge>
    }
  }

  const getStatusAction = (status) => {
    switch (status) {
      case 'active':
        return <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Pause className="h-3 w-3" /></Button>
      case 'paused':
        return <Button size="sm" variant="outline" className="h-6 w-6 p-0"><Play className="h-3 w-3" /></Button>
      default:
        return <Button size="sm" variant="outline" className="h-6 w-6 p-0"><BarChart3 className="h-3 w-3" /></Button>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getBudgetProgress = (spent, budget) => {
    return (spent / budget) * 100
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Campaign Performance</CardTitle>
        <Button size="sm" variant="outline">
          <Target className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campaign List */}
        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCampaignIcon(campaign.type)}</span>
                  <div>
                    <h4 className="text-sm">{campaign.name}</h4>
                    <p className="text-xs text-muted-foreground">{campaign.partner}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(campaign.status)}
                  {getStatusAction(campaign.status)}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1">
                    <Eye className="h-3 w-3 text-blue-500" />
                    <span>Impressions</span>
                  </span>
                  <span>{campaign.impressions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-1">
                    <MousePointer className="h-3 w-3 text-green-500" />
                    <span>Clicks</span>
                  </span>
                  <span>{campaign.clicks.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>CTR</span>
                  <span>{campaign.ctr}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Leads</span>
                  <span>{campaign.leads}</span>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Budget</span>
                  <span>{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</span>
                </div>
                <Progress value={getBudgetProgress(campaign.spent, campaign.budget)} className="h-1" />
              </div>

              {/* Conversion Info */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs">
                <span>Conversions</span>
                <div className="flex items-center space-x-2">
                  <span>{campaign.conversions}</span>
                  <Badge variant="outline" className="text-xs">
                    {((campaign.conversions / campaign.leads) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="w-full">
              <Play className="h-4 w-4 mr-1" />
              New Campaign
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <BarChart3 className="h-4 w-4 mr-1" />
              View Reports
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}