
import React, { useEffect, useState } from 'react';
import { QueryResponse } from '../utils/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, BarChart3, Info, TrendingUp, Network, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

interface ResultDisplayProps {
  response: QueryResponse | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ response, isLoading }) => {
  const [clusterChart, setClusterChart] = useState<HTMLDivElement | null>(null);
  const [riskChart, setRiskChart] = useState<HTMLDivElement | null>(null);
  const [statsChart, setStatsChart] = useState<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // In a real implementation, we would use Plotly.js or D3 to render charts
    if (response?.visualData && clusterChart && riskChart) {
      renderClusterChart();
      renderRiskChart();
    }
    
    if (response?.visualData?.basicStats && statsChart) {
      renderStatsChart();
    }
  }, [response, clusterChart, riskChart, statsChart]);
  
  const renderClusterChart = () => {
    if (!clusterChart || !response?.visualData?.clusters) return;
    
    clusterChart.innerHTML = '';
    const maxCount = Math.max(...response.visualData.clusters.map(c => c.count));
    
    response.visualData.clusters.forEach(cluster => {
      const bar = document.createElement('div');
      bar.className = 'flex items-end mb-4 animate-slide-up';
      bar.style.animationDelay = `${cluster.id * 100}ms`;
      
      const label = document.createElement('div');
      label.className = 'w-28 text-sm font-medium';
      label.textContent = cluster.name;
      
      const barContainer = document.createElement('div');
      barContainer.className = 'flex-1 h-7 flex items-center';
      
      const barEl = document.createElement('div');
      barEl.className = 'h-full rounded-r-sm transition-all duration-1000';
      barEl.style.width = `${(cluster.count / maxCount) * 100}%`;
      barEl.style.backgroundColor = cluster.color;
      barEl.style.opacity = '0';
      
      const countEl = document.createElement('div');
      countEl.className = 'ml-2 text-sm';
      countEl.textContent = `${cluster.count} (${cluster.percentage ? cluster.percentage.toFixed(1) : '0'}%)`;
      
      barContainer.appendChild(barEl);
      barContainer.appendChild(countEl);
      
      bar.appendChild(label);
      bar.appendChild(barContainer);
      
      clusterChart.appendChild(bar);
      
      // Trigger animation
      setTimeout(() => {
        barEl.style.opacity = '1';
      }, 50);
    });
  };
  
  const renderRiskChart = () => {
    if (!riskChart || !response?.visualData?.riskScores) return;
    
    riskChart.innerHTML = '';
    
    response.visualData.riskScores.forEach((risk, index) => {
      const riskItem = document.createElement('div');
      riskItem.className = 'mb-5 animate-slide-up';
      riskItem.style.animationDelay = `${index * 100}ms`;
      
      const header = document.createElement('div');
      header.className = 'flex justify-between items-center mb-1';
      
      const supplier = document.createElement('div');
      supplier.className = 'text-sm font-medium';
      supplier.textContent = risk.supplier;
      
      const score = document.createElement('div');
      score.className = 'text-sm';
      score.textContent = risk.score.toFixed(2);
      
      header.appendChild(supplier);
      header.appendChild(score);
      
      const barContainer = document.createElement('div');
      barContainer.className = 'w-full bg-secondary h-2 rounded-full overflow-hidden';
      
      const bar = document.createElement('div');
      bar.className = 'h-full transition-all duration-1000';
      bar.style.width = '0%';
      
      // Set color based on risk score
      if (risk.score >= 0.7) {
        bar.className += ' bg-red-500';
      } else if (risk.score >= 0.4) {
        bar.className += ' bg-orange-500';
      } else {
        bar.className += ' bg-green-500';
      }
      
      barContainer.appendChild(bar);
      
      const reasons = document.createElement('div');
      reasons.className = 'mt-1 text-xs text-muted-foreground';
      reasons.textContent = risk.reasons.join(', ');
      
      riskItem.appendChild(header);
      riskItem.appendChild(barContainer);
      riskItem.appendChild(reasons);
      
      riskChart.appendChild(riskItem);
      
      // Trigger animation
      setTimeout(() => {
        bar.style.width = `${risk.score * 100}%`;
      }, 50);
    });
  };
  
  const renderStatsChart = () => {
    if (!statsChart || !response?.visualData?.basicStats) return;
    
    statsChart.innerHTML = '';
    
    // Display basic graph statistics
    if (response.visualData.basicStats.degree_distribution) {
      // For degree distribution, we'll show a simple bar chart
      const degreeData = response.visualData.basicStats.degree_distribution;
      
      const title = document.createElement('div');
      title.className = 'text-sm font-medium mb-2';
      title.textContent = 'Degree Distribution (first 20 values)';
      
      statsChart.appendChild(title);
      
      // In-degree distribution
      if (degreeData.in_degree) {
        const inDegreeTitle = document.createElement('div');
        inDegreeTitle.className = 'text-xs text-muted-foreground mb-1 mt-2';
        inDegreeTitle.textContent = 'In-Degree Distribution';
        statsChart.appendChild(inDegreeTitle);
        
        const maxValue = Math.max(...Object.values(degreeData.in_degree) as number[]);
        
        Object.entries(degreeData.in_degree).slice(0, 10).forEach(([degree, probability], index) => {
          const row = document.createElement('div');
          row.className = 'flex items-center mb-1 text-xs';
          
          const label = document.createElement('div');
          label.className = 'w-16 text-right pr-2';
          label.textContent = `Degree ${degree}:`;
          
          const barContainer = document.createElement('div');
          barContainer.className = 'flex-1 h-2 bg-secondary rounded-full overflow-hidden';
          
          const bar = document.createElement('div');
          bar.className = 'h-full bg-blue-500 transition-all duration-1000';
          bar.style.width = `${((probability as number) / maxValue) * 100}%`;
          
          const valueLabel = document.createElement('div');
          valueLabel.className = 'ml-2 text-xs text-muted-foreground';
          valueLabel.textContent = (probability as number).toFixed(4);
          
          barContainer.appendChild(bar);
          row.appendChild(label);
          row.appendChild(barContainer);
          row.appendChild(valueLabel);
          
          statsChart.appendChild(row);
        });
      }
      
      // Out-degree distribution
      if (degreeData.out_degree) {
        const outDegreeTitle = document.createElement('div');
        outDegreeTitle.className = 'text-xs text-muted-foreground mb-1 mt-3';
        outDegreeTitle.textContent = 'Out-Degree Distribution';
        statsChart.appendChild(outDegreeTitle);
        
        const maxValue = Math.max(...Object.values(degreeData.out_degree) as number[]);
        
        Object.entries(degreeData.out_degree).slice(0, 10).forEach(([degree, probability], index) => {
          const row = document.createElement('div');
          row.className = 'flex items-center mb-1 text-xs';
          
          const label = document.createElement('div');
          label.className = 'w-16 text-right pr-2';
          label.textContent = `Degree ${degree}:`;
          
          const barContainer = document.createElement('div');
          barContainer.className = 'flex-1 h-2 bg-secondary rounded-full overflow-hidden';
          
          const bar = document.createElement('div');
          bar.className = 'h-full bg-green-500 transition-all duration-1000';
          bar.style.width = `${((probability as number) / maxValue) * 100}%`;
          
          const valueLabel = document.createElement('div');
          valueLabel.className = 'ml-2 text-xs text-muted-foreground';
          valueLabel.textContent = (probability as number).toFixed(4);
          
          barContainer.appendChild(bar);
          row.appendChild(label);
          row.appendChild(barContainer);
          row.appendChild(valueLabel);
          
          statsChart.appendChild(row);
        });
      }
    } else if (response.visualData.basicStats.hubs) {
      // Display hub information
      const hubs = response.visualData.basicStats.hubs;
      
      // Top nodes by in-degree
      if (hubs.top_in_degree_nodes && hubs.top_in_degree_nodes.length > 0) {
        const title = document.createElement('div');
        title.className = 'text-sm font-medium mb-2';
        title.textContent = 'Top Products by In-Degree (Most Purchased With)';
        statsChart.appendChild(title);
        
        const maxDegree = hubs.top_in_degree_nodes[0][1];
        
        hubs.top_in_degree_nodes.forEach(([node, degree], index) => {
          const row = document.createElement('div');
          row.className = 'flex items-center mb-2 animate-slide-up';
          row.style.animationDelay = `${index * 50}ms`;
          
          const label = document.createElement('div');
          label.className = 'w-20 text-xs';
          label.textContent = `Product-${node}`;
          
          const barContainer = document.createElement('div');
          barContainer.className = 'flex-1 h-4 flex items-center';
          
          const bar = document.createElement('div');
          bar.className = 'h-full bg-blue-500 rounded-r-sm transition-all duration-1000';
          bar.style.width = `${(degree as number / maxDegree) * 100}%`;
          bar.style.opacity = '0';
          
          const degreeLabel = document.createElement('div');
          degreeLabel.className = 'ml-2 text-xs';
          degreeLabel.textContent = `${degree} links`;
          
          barContainer.appendChild(bar);
          
          row.appendChild(label);
          row.appendChild(barContainer);
          row.appendChild(degreeLabel);
          
          statsChart.appendChild(row);
          
          // Trigger animation
          setTimeout(() => {
            bar.style.opacity = '1';
          }, 50);
        });
      }
      
      // Top nodes by PageRank
      if (hubs.top_pagerank_nodes && hubs.top_pagerank_nodes.length > 0) {
        const title = document.createElement('div');
        title.className = 'text-sm font-medium mb-2 mt-4';
        title.textContent = 'Top Products by PageRank (Most Influential)';
        statsChart.appendChild(title);
        
        const maxRank = hubs.top_pagerank_nodes[0][1];
        
        hubs.top_pagerank_nodes.forEach(([node, rank], index) => {
          const row = document.createElement('div');
          row.className = 'flex items-center mb-2 animate-slide-up';
          row.style.animationDelay = `${index * 50}ms`;
          
          const label = document.createElement('div');
          label.className = 'w-20 text-xs';
          label.textContent = `Product-${node}`;
          
          const barContainer = document.createElement('div');
          barContainer.className = 'flex-1 h-4 flex items-center';
          
          const bar = document.createElement('div');
          bar.className = 'h-full bg-violet-500 rounded-r-sm transition-all duration-1000';
          bar.style.width = `${(rank as number / maxRank) * 100}%`;
          bar.style.opacity = '0';
          
          const rankLabel = document.createElement('div');
          rankLabel.className = 'ml-2 text-xs';
          rankLabel.textContent = (rank as number).toFixed(6);
          
          barContainer.appendChild(bar);
          
          row.appendChild(label);
          row.appendChild(barContainer);
          row.appendChild(rankLabel);
          
          statsChart.appendChild(row);
          
          // Trigger animation
          setTimeout(() => {
            bar.style.opacity = '1';
          }, 50);
        });
      }
    } else {
      // Display general network statistics
      const stats = response.visualData.basicStats;
      
      const statsList = [
        { label: 'Number of Products (Nodes)', value: stats.num_nodes?.toLocaleString() },
        { label: 'Number of Connections (Edges)', value: stats.num_edges?.toLocaleString() },
        { label: 'Network Density', value: stats.density?.toFixed(8) },
        { label: 'Largest Connected Component', value: `${stats.largest_cc_size?.toLocaleString()} (${stats.largest_cc_percentage?.toFixed(2)}%)` },
        { label: 'Average In-Degree', value: stats.avg_in_degree?.toFixed(2) },
        { label: 'Average Out-Degree', value: stats.avg_out_degree?.toFixed(2) },
        { label: 'Maximum In-Degree', value: stats.max_in_degree },
        { label: 'Maximum Out-Degree', value: stats.max_out_degree }
      ];
      
      const table = document.createElement('div');
      table.className = 'w-full border rounded-md overflow-hidden';
      
      statsList.forEach((stat, i) => {
        const row = document.createElement('div');
        row.className = cn(
          'flex items-center p-2',
          i % 2 === 0 ? 'bg-secondary/30' : 'bg-background'
        );
        
        const label = document.createElement('div');
        label.className = 'w-2/3 text-sm';
        label.textContent = stat.label;
        
        const value = document.createElement('div');
        value.className = 'w-1/3 text-sm font-medium text-right';
        value.textContent = stat.value;
        
        row.appendChild(label);
        row.appendChild(value);
        table.appendChild(row);
      });
      
      statsChart.appendChild(table);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!response) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-2">Enter a supply chain query</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try queries like "Show me network statistics", "Identify risk clusters", or "Find the most important products".
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto mb-16 opacity-0", 
      "animate-fade-in"
    )}>
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className={cn(
          "pb-3",
          response.type === "complex" ? "bg-orange-50" : 
          response.type === "hybrid" ? "bg-blue-50" : "bg-green-50"
        )}>
          <div className="flex items-center space-x-2">
            {response.type === "complex" ? (
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            ) : response.type === "hybrid" ? (
              <TrendingUp className="h-5 w-5 text-blue-500" />
            ) : (
              <Info className="h-5 w-5 text-green-500" />
            )}
            <CardTitle className="text-lg">
              {response.type === "complex" 
                ? "Network Community Analysis" 
                : response.type === "hybrid" 
                  ? "Hybrid Network Analysis" 
                  : "Network Statistics"}
            </CardTitle>
          </div>
          <CardDescription>
            {response.type === "complex" 
              ? "Using NetworkX Louvain community detection" 
              : response.type === "hybrid" 
                ? "Combining graph metrics and community detection" 
                : "Using NetworkX graph analysis"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-base leading-relaxed mb-6">
            {response.text}
          </div>
          
          {response.visualData && (
            <div className="mt-8 space-y-8">
              {response.visualData.basicStats && (
                <div className="animate-fade-in">
                  <div className="flex items-center mb-4">
                    <Database className="mr-2 h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Network Statistics</h3>
                  </div>
                  <div 
                    className="pl-2" 
                    ref={setStatsChart}
                  ></div>
                </div>
              )}
              
              {response.visualData.clusters && (
                <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                  <div className="flex items-center mb-4">
                    <Network className="mr-2 h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Product Communities</h3>
                  </div>
                  <div 
                    className="pl-2" 
                    ref={setClusterChart}
                  ></div>
                </div>
              )}
              
              {response.visualData.riskScores && (
                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="mr-2 h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Product Risk Analysis</h3>
                  </div>
                  <div 
                    className="pl-2" 
                    ref={setRiskChart}
                  ></div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDisplay;
