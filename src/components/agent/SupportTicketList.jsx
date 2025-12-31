import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, XCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  open: {
    label: "Open",
    icon: AlertCircle,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  },
  waiting_response: {
    label: "Waiting Response",
    icon: MessageSquare,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
    color: "bg-green-500/20 text-green-400 border-green-500/30"
  },
  closed: {
    label: "Closed",
    icon: XCircle,
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
};

const priorityConfig = {
  low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function SupportTicketList({ tickets, sites }) {
  const sortedTickets = [...tickets].sort((a, b) => {
    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  });

  if (tickets.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No support tickets yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTickets.map(ticket => {
        const site = sites.find(s => s.id === ticket.site_id);
        const status = statusConfig[ticket.status];
        const StatusIcon = status.icon;

        return (
          <Card key={ticket.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{ticket.subject}</h3>
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    <Badge className={priorityConfig[ticket.priority]} variant="outline">
                      {ticket.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span>Site: <span className="text-white">{site?.name || 'Unknown'}</span></span>
                    <span>•</span>
                    <span>Category: <span className="text-white capitalize">{ticket.category.replace('_', ' ')}</span></span>
                    <span>•</span>
                    <span>{format(new Date(ticket.created_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{ticket.description}</p>
                  {ticket.assigned_to && (
                    <div className="text-sm text-gray-400">
                      Assigned to: <span className="text-white">{ticket.assigned_to}</span>
                    </div>
                  )}
                  {ticket.resolution_notes && (
                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="text-sm text-green-400 font-medium mb-1">Resolution:</div>
                      <div className="text-sm text-gray-300">{ticket.resolution_notes}</div>
                      {ticket.resolved_date && (
                        <div className="text-xs text-gray-500 mt-1">
                          Resolved on {format(new Date(ticket.resolved_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}