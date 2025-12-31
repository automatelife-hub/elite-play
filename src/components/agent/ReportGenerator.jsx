import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileDown, FileText, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export default function ReportGenerator({ players, commissions, sites, agent }) {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [minRevenue, setMinRevenue] = useState("");
  const [reportType, setReportType] = useState("summary");

  const filteredData = useMemo(() => {
    let filtered = players.filter(player => {
      const signupDate = new Date(player.signup_date);
      const inDateRange = signupDate >= dateRange.from && signupDate <= dateRange.to;
      const matchesSite = selectedSite === "all" || player.site_id === selectedSite;
      const matchesPlatform = selectedPlatform === "all" || player.platform === selectedPlatform;
      const matchesRevenue = !minRevenue || (player.total_revenue || 0) >= parseFloat(minRevenue);
      return inDateRange && matchesSite && matchesPlatform && matchesRevenue;
    });

    const relatedCommissions = commissions.filter(comm => {
      const periodDate = new Date(comm.period_end);
      return periodDate >= dateRange.from && periodDate <= dateRange.to;
    });

    return { players: filtered, commissions: relatedCommissions };
  }, [players, commissions, dateRange, selectedSite, selectedPlatform, minRevenue]);

  const reportStats = useMemo(() => {
    const totalPlayers = filteredData.players.length;
    const activePlayers = filteredData.players.filter(p => p.status === "active" || p.status === "approved").length;
    const totalRevenue = filteredData.players.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
    const totalCommission = filteredData.commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
    const avgRevenuePerPlayer = totalPlayers > 0 ? totalRevenue / totalPlayers : 0;
    
    const platformBreakdown = {};
    filteredData.players.forEach(p => {
      if (!platformBreakdown[p.platform]) {
        platformBreakdown[p.platform] = { count: 0, revenue: 0 };
      }
      platformBreakdown[p.platform].count++;
      platformBreakdown[p.platform].revenue += p.total_revenue || 0;
    });

    return {
      totalPlayers,
      activePlayers,
      totalRevenue,
      totalCommission,
      avgRevenuePerPlayer,
      platformBreakdown
    };
  }, [filteredData]);

  const exportToCSV = () => {
    try {
      let csvContent = "";
      
      if (reportType === "summary") {
        csvContent = "Report Summary\n\n";
        csvContent += `Date Range,${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}\n`;
        csvContent += `Total Players,${reportStats.totalPlayers}\n`;
        csvContent += `Active Players,${reportStats.activePlayers}\n`;
        csvContent += `Total Revenue,$${reportStats.totalRevenue.toFixed(2)}\n`;
        csvContent += `Total Commission,$${reportStats.totalCommission.toFixed(2)}\n`;
        csvContent += `Avg Revenue per Player,$${reportStats.avgRevenuePerPlayer.toFixed(2)}\n\n`;
        
        csvContent += "Platform Breakdown\n";
        csvContent += "Platform,Players,Revenue\n";
        Object.entries(reportStats.platformBreakdown).forEach(([platform, data]) => {
          csvContent += `${platform},${data.count},$${data.revenue.toFixed(2)}\n`;
        });
      } else if (reportType === "players") {
        csvContent = "Player Report\n\n";
        csvContent += "Username,Site,Platform,Status,Revenue,Monthly Revenue,Signup Date\n";
        filteredData.players.forEach(player => {
          const site = sites.find(s => s.id === player.site_id);
          csvContent += `${player.player_username},${site?.name || 'Unknown'},${player.platform},${player.status},$${(player.total_revenue || 0).toFixed(2)},$${(player.monthly_revenue || 0).toFixed(2)},${player.signup_date}\n`;
        });
      } else if (reportType === "commissions") {
        csvContent = "Commission Report\n\n";
        csvContent += "Period,Player,Site,Revenue,Rate,Commission,Status,Paid Date\n";
        filteredData.commissions.forEach(comm => {
          const player = players.find(p => p.id === comm.player_id);
          const site = sites.find(s => s.id === comm.site_id);
          csvContent += `${format(new Date(comm.period_start), 'MMM dd')} - ${format(new Date(comm.period_end), 'MMM dd, yyyy')},${player?.player_username || 'Unknown'},${site?.name || 'Unknown'},$${comm.revenue_generated.toFixed(2)},${comm.commission_rate}%,$${comm.commission_amount.toFixed(2)},${comm.payout_status},${comm.payout_date || '-'}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `agent_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV report exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Header
      doc.setFontSize(18);
      doc.text("Agent Performance Report", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy')}`, 20, yPos);
      yPos += 5;
      doc.text(`Period: ${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`, 20, yPos);
      yPos += 15;

      // Summary Stats
      doc.setFontSize(14);
      doc.text("Summary Statistics", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      const stats = [
        [`Total Players: ${reportStats.totalPlayers}`, `Active Players: ${reportStats.activePlayers}`],
        [`Total Revenue: $${reportStats.totalRevenue.toFixed(2)}`, `Avg per Player: $${reportStats.avgRevenuePerPlayer.toFixed(2)}`],
        [`Total Commission: $${reportStats.totalCommission.toFixed(2)}`, `Commission Rate: ${agent?.commission_rate || 0}%`]
      ];

      stats.forEach(row => {
        doc.text(row[0], 20, yPos);
        doc.text(row[1], 110, yPos);
        yPos += 7;
      });

      yPos += 10;

      // Platform Breakdown
      if (Object.keys(reportStats.platformBreakdown).length > 0) {
        doc.setFontSize(14);
        doc.text("Platform Breakdown", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        Object.entries(reportStats.platformBreakdown).forEach(([platform, data]) => {
          doc.text(`${platform}: ${data.count} players, $${data.revenue.toFixed(2)} revenue`, 20, yPos);
          yPos += 7;
        });
        yPos += 10;
      }

      // Top Players
      if (filteredData.players.length > 0) {
        doc.setFontSize(14);
        doc.text("Top Performers", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        const topPlayers = [...filteredData.players]
          .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
          .slice(0, 10);

        topPlayers.forEach((player, idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const site = sites.find(s => s.id === player.site_id);
          doc.text(`${idx + 1}. ${player.player_username} (${site?.name || 'Unknown'}) - $${(player.total_revenue || 0).toFixed(2)}`, 20, yPos);
          yPos += 7;
        });
      }

      doc.save(`agent_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success("PDF report exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <Label className="text-gray-300 mb-2 block">Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-white justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.to, "MMM dd, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Site Filter */}
            <div>
              <Label className="text-gray-300 mb-2 block">Site</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {sites.map(site => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Filter */}
            <div>
              <Label className="text-gray-300 mb-2 block">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="poker">Poker</SelectItem>
                  <SelectItem value="casino">Casino</SelectItem>
                  <SelectItem value="sportsbetting">Sportsbetting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Revenue Filter */}
            <div>
              <Label className="text-gray-300 mb-2 block">Min Revenue</Label>
              <Input
                type="number"
                placeholder="$0"
                value={minRevenue}
                onChange={(e) => setMinRevenue(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Report Type */}
            <div>
              <Label className="text-gray-300 mb-2 block">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="players">Player Details</SelectItem>
                  <SelectItem value="commissions">Commission Details</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Report Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Total Players</div>
              <div className="text-2xl font-bold text-white">{reportStats.totalPlayers}</div>
              <div className="text-xs text-gray-500 mt-1">{reportStats.activePlayers} active</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-green-400">${reportStats.totalRevenue.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">Avg ${reportStats.avgRevenuePerPlayer.toFixed(2)}/player</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Commission Earned</div>
              <div className="text-2xl font-bold text-yellow-400">${reportStats.totalCommission.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">{filteredData.commissions.length} transactions</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Commission Rate</div>
              <div className="text-2xl font-bold text-white">{agent?.commission_rate || 0}%</div>
              <div className="text-xs text-gray-500 mt-1">Current rate</div>
            </div>
          </div>

          {/* Platform Breakdown */}
          {Object.keys(reportStats.platformBreakdown).length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Platform Distribution</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(reportStats.platformBreakdown).map(([platform, data]) => (
                  <div key={platform} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium capitalize">{platform}</span>
                      <span className="text-gray-400 text-sm">{data.count} players</span>
                    </div>
                    <div className="text-green-400 font-semibold">${data.revenue.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Data Preview */}
      {reportType === "players" && filteredData.players.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Player Details ({filteredData.players.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-900">
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Username</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Site</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Platform</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Revenue</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.players.map(player => {
                    const site = sites.find(s => s.id === player.site_id);
                    return (
                      <tr key={player.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-white">{player.player_username}</td>
                        <td className="py-3 px-4 text-gray-300">{site?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-300 capitalize">{player.platform}</td>
                        <td className="py-3 px-4 text-green-400 font-semibold">${(player.total_revenue || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-300 capitalize">{player.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === "commissions" && filteredData.commissions.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Commission Details ({filteredData.commissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-900">
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Period</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Player</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Revenue</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Commission</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.commissions.map(comm => {
                    const player = players.find(p => p.id === comm.player_id);
                    return (
                      <tr key={comm.id} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-gray-300 text-sm">
                          {format(new Date(comm.period_start), 'MMM dd')} - {format(new Date(comm.period_end), 'MMM dd')}
                        </td>
                        <td className="py-3 px-4 text-white">{player?.player_username || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-300">${comm.revenue_generated.toFixed(2)}</td>
                        <td className="py-3 px-4 text-green-400 font-semibold">${comm.commission_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-300 capitalize">{comm.payout_status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}