
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";

const categoryColors = {
  "poker-strategy": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "casino-guides": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "site-reviews": "bg-green-500/10 text-green-400 border-green-500/20",
  "industry-news": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "beginners": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
};

export default function LatestArticles({ articles, loading }) {
  const whatsappURL = base44.agents.getWhatsAppConnectURL('poker_advisor');

  if (loading) {
    return (
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mx-auto mb-12 bg-slate-800" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) =>
            <Skeleton key={i} className="h-72 bg-slate-800 rounded-xl" />
            )}
          </div>
        </div>
      </section>);

  }

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-cyan-400 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Latest Insights</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expert strategies, tips, and industry news to elevate your game
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) =>
          <Card key={article.id} className="bg-slate-900 text-card-foreground rounded-lg group border shadow-sm from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
              {article.featured_image &&
            <div className="h-48 overflow-hidden">
                  <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                </div>
            }
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                  variant="outline"
                  className={categoryColors[article.category] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}>

                    {article.category?.replace(/-/g, ' ')}
                  </Badge>
                  {article.reading_time &&
                <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.reading_time}min
                    </div>
                }
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {format(new Date(article.created_date), 'MMM d, yyyy')}
                  </span>
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-0">
                    Read More <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={createPageUrl("Guides")}>
            <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 hover:text-white px-8 py-3 text-lg font-semibold rounded-xl border-2 border-yellow-500 hover:border-yellow-600 transition-all duration-300 transform hover:scale-105">

              Read All Guides
            </Button>
          </Link>
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer">

            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg rounded-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Chat with Advisor
            </Button>
          </a>
        </div>
      </div>
    </section>);

}