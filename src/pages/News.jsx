import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Article } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageUrl } from "@/utils";

const categoryColors = {
  'poker-strategy': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'casino-guides': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'site-reviews': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'industry-news': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'beginners': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const categoryNames = {
  'poker-strategy': 'Poker Strategy',
  'casino-guides': 'Casino Guides',
  'site-reviews': 'Site Reviews',
  'industry-news': 'Industry News',
  'beginners': 'Beginners',
};

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const filters = { published: true };
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      const data = await Article.filter(filters, '-created_date', 50);
      setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePullToRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadArticles();
    setRefreshing(false);
  }, [selectedCategory]);

  React.useEffect(() => {
    let startY = 0;
    let pulling = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0 && window.innerWidth < 768) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (pulling && window.innerWidth < 768) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 80 && !refreshing) {
          handlePullToRefresh();
          pulling = false;
        }
      }
    };

    const handleTouchEnd = () => {
      pulling = false;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshing, handlePullToRefresh]);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12">
      {refreshing && (
        <div className="fixed top-16 left-0 right-0 z-50 flex justify-center">
          <div className="bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
              Refreshing...
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="text-emerald-400">News & Articles</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest poker strategies, casino guides, and industry news
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={selectedCategory === 'all' 
              ? 'bg-emerald-500 hover:bg-emerald-600' 
              : 'border-gray-700 text-gray-300 hover:bg-gray-800'
            }
          >
            All Articles
          </Button>
          {Object.entries(categoryNames).map(([key, name]) => (
            <Button
              key={key}
              onClick={() => setSelectedCategory(key)}
              variant={selectedCategory === key ? 'default' : 'outline'}
              className={selectedCategory === key 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'border-gray-700 text-gray-300 hover:bg-gray-800'
              }
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800">
                <Skeleton className="h-48 w-full bg-gray-800 rounded-t-xl" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mb-3 bg-gray-800" />
                  <Skeleton className="h-8 w-full mb-3 bg-gray-800" />
                  <Skeleton className="h-20 w-full mb-4 bg-gray-800" />
                  <Skeleton className="h-10 w-full bg-gray-800" />
                </CardContent>
              </Card>
            ))
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <Card 
                key={article.id} 
                className="bg-gray-900 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden group"
              >
                {article.featured_image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={categoryColors[article.category] || 'bg-gray-700 text-gray-300'}>
                      {categoryNames[article.category] || article.category}
                    </Badge>
                    {article.reading_time && (
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.reading_time} min read
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.created_date).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}