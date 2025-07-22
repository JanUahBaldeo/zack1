import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { TrendingUp, Mail, MousePointer, Users, Eye } from 'lucide-react'
import { fetchMarketingMetrics } from './api';

export function MarketingWidget({ token }) {
  const [metrics, setMetrics] = useState({ campaigns: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMarketingMetrics(token)
      .then(data => {
        setMetrics(data || { campaigns: [] });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load marketing metrics');
        setLoading(false);
      });
  }, [token]);

  // Remove mockCampaigns, use metrics.campaigns from state
  if (loading) {
    return <div className="text-center py-8">Loading marketing metrics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'social':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'paid':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'organic':
        return <Eye className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="text-xs bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge className="text-xs bg-yellow-100 text-yellow-800">Paused</Badge>
      case 'completed':
        return <Badge className="text-xs bg-gray-100 text-gray-800">Completed</Badge>
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Marketing Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Eye className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-sm text-muted-foreground">Avg Open Rate</p>
            <p className="text-lg">24.7%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <MousePointer className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-sm text-muted-foreground">Avg CTR</p>
            <p className="text-lg">6.2%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-sm text-muted-foreground">New Leads</p>
            <p className="text-lg">55</p>
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Recent Campaigns</h4>
          {metrics.campaigns.map(campaign => (
            <div key={campaign.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getCampaignIcon(campaign.type)}
                  <span className="text-sm">{campaign.name}</span>
                </div>
                {getStatusBadge(campaign.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Open Rate</span>
                  <span>{campaign.openRate}%</span>
                </div>
                <Progress value={campaign.openRate} className="h-1" />
                
                <div className="flex items-center justify-between text-xs">
                  <span>Click Rate</span>
                  <span>{campaign.clickRate}%</span>
                </div>
                <Progress value={campaign.clickRate} className="h-1" />
                
                <div className="flex items-center justify-between text-xs">
                  <span>Leads Generated</span>
                  <span>{campaign.leads}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Sources */}
        <div className="pt-4 border-t">
          <h4 className="text-sm text-muted-foreground mb-3">Top Lead Sources</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Email Campaigns</span>
              <span>43 leads</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Referrals</span>
              <span>28 leads</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Social Media</span>
              <span>19 leads</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Website</span>
              <span>15 leads</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}