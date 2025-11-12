
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Calendar, Mail, User } from "lucide-react";
import { format } from "date-fns";

export default function SignupCard({ signup, site, onDelete }) {
  const statusColors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {site?.logo_url && (
              <div className="bg-white rounded-lg p-2 shadow-md flex-shrink-0">
                <img 
                  src={site.logo_url} 
                  alt={site.name}
                  className="w-12 h-12 object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-white">{site?.name || "Unknown Site"}</h3>
                <Badge variant="outline" className={statusColors[signup.status]}>
                  {signup.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{signup.site_username}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="truncate">{signup.site_email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Joined: {format(new Date(signup.signup_date), 'MMM d, yyyy')}
                </div>
                {signup.referral_code && (
                  <div className="flex items-center text-gray-300">
                    <span className="text-yellow-400 mr-2">🎁</span>
                    Code: {signup.referral_code}
                  </div>
                )}
              </div>
              
              {signup.notes && (
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{signup.notes}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {site?.affiliate_url && (
              <a
                href={site.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
