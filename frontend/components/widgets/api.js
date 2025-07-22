// API utility for widgets

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPipeline(token) {
  const res = await fetch(`${API_URL}/api/loans/pipeline`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch pipeline');
  return res.json();
}

export async function fetchTasks(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/tasks${query ? '?' + query : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function fetchNotifications(token) {
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function fetchCalendarEvents(token) {
  const res = await fetch(`${API_URL}/api/calendar/events`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch calendar events');
  return res.json();
}

export async function fetchDocuments(token) {
  const res = await fetch(`${API_URL}/api/documents/checklist`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchCampaigns(token) {
  const res = await fetch(`${API_URL}/api/campaigns`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function fetchCommunications(token) {
  const res = await fetch(`${API_URL}/api/communications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch communications');
  return res.json();
}

export async function fetchLeadAnalytics(token) {
  const res = await fetch(`${API_URL}/api/marketing/lead-analytics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch lead analytics');
  return res.json();
}

export async function fetchMarketingMetrics(token) {
  const res = await fetch(`${API_URL}/api/marketing/metrics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch marketing metrics');
  return res.json();
}

export async function fetchPerformance(token) {
  const res = await fetch(`${API_URL}/api/production/overview`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch performance data');
  return res.json();
} 