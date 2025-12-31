import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, DollarSign, UserPlus, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function NotificationBell({ players, commissions }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [players, commissions]);

  const generateNotifications = () => {
    const notifs = [];
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // New player signups (last 7 days)
    players
      .filter(p => p.signup_date && new Date(p.signup_date) > sevenDaysAgo)
      .forEach(player => {
        notifs.push({
          id: `player-${player.id}`,
          type: 'player_signup',
          icon: UserPlus,
          color: 'text-blue-400',
          title: 'New Player Signup',
          message: `${player.player_username} joined via your link`,
          date: new Date(player.signup_date),
          unread: true
        });
      });

    // Recent commissions
    commissions
      .filter(c => c.created_date && new Date(c.created_date) > sevenDaysAgo)
      .slice(0, 5)
      .forEach(commission => {
        notifs.push({
          id: `commission-${commission.id}`,
          type: 'commission',
          icon: DollarSign,
          color: 'text-green-400',
          title: 'Commission Earned',
          message: `$${commission.commission_amount.toFixed(2)} added to your balance`,
          date: new Date(commission.created_date),
          unread: true
        });
      });

    // Pending approvals
    const pendingPlayers = players.filter(p => p.status === 'pending');
    if (pendingPlayers.length > 0) {
      notifs.push({
        id: 'pending-approval',
        type: 'pending',
        icon: AlertCircle,
        color: 'text-yellow-400',
        title: 'Players Pending Approval',
        message: `${pendingPlayers.length} player${pendingPlayers.length > 1 ? 's' : ''} awaiting admin approval`,
        date: now,
        unread: true
      });
    }

    // Sort by date, most recent first
    notifs.sort((a, b) => b.date - a.date);

    setNotifications(notifs.slice(0, 10));
    setUnreadCount(notifs.filter(n => n.unread).length);
  };

  const markAllRead = () => {
    setNotifications(notifs => notifs.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-gray-900 border-gray-800 text-white p-0" 
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="text-xs text-gray-400 hover:text-white"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                    notif.unread ? 'bg-gray-800/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notif.title}</p>
                        {notif.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(notif.date, 'MMM dd, h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}