import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Loader2 } from 'lucide-react';
import { excelAPI, chartAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const ChartAnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get('fileId'); // Changed from recordId to fileId
  
  const [excelData, setExcelData] = useState<any>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    title: '',
    xAxis: '',
    yAxis: '',
  });
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (fileId) {
      fetchExcelData(fileId);
    }
  }, [fileId]);

  const fetchExcelData = async (id: string) => {
    setLoading(true);
    try {
      const response = await excelAPI.getExcelData(id);
      setExcelData(response.record);
      if (response.record.data && response.record.data.length > 0) {
        setColumns(Object.keys(response.record.data[0]));
      }
    } catch (error) {
      toast.error('Failed to load Excel data');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    if (!excelData || !chartConfig.xAxis || !chartConfig.yAxis) return;

    const data = excelData.data;
    
    if (chartConfig.type === 'pie') {
      // Aggregate data for pie chart
      const aggregated: { [key: string]: number } = {};
      data.forEach((row: any) => {
        const category = row[chartConfig.xAxis];
        const value = parseFloat(row[chartConfig.yAxis]) || 0;
        aggregated[category] = (aggregated[category] || 0) + value;
      });

      setChartData({
        labels: Object.keys(aggregated),
        datasets: [{
          data: Object.values(aggregated),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        }],
      });
    } else {
      // For bar, line, and scatter charts
      const labels = data.map((row: any) => row[chartConfig.xAxis]);
      const values = data.map((row: any) => parseFloat(row[chartConfig.yAxis]) || 0);

      setChartData({
        labels,
        datasets: [{
          label: chartConfig.yAxis,
          data: values,
          backgroundColor: chartConfig.type === 'bar' ? 'rgba(54, 162, 235, 0.6)' : undefined,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
        }],
      });
    }
  };

  const handleConfigChange = (field: string, value: string) => {
    setChartConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChart = async () => {
    if (!chartData || !chartConfig.title) {
      toast.error('Please configure the chart and add a title');
      return;
    }

    setSaving(true);
    try {
      await chartAPI.saveChart({
        title: chartConfig.title,
        type: chartConfig.type,
        config: chartConfig,
        data: chartData,
        excelRecordId: fileId, // Updated to use fileId
      });
      toast.success('Chart saved successfully!');
    } catch (error) {
      toast.error('Failed to save chart');
    } finally {
      setSaving(false);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: chartConfig.title || 'Chart Preview',
        },
      },
      scales: chartConfig.type !== 'pie' ? {
        x: {
          title: {
            display: true,
            text: chartConfig.xAxis,
          },
        },
        y: {
          title: {
            display: true,
            text: chartConfig.yAxis,
          },
        },
      } : undefined,
    };

    switch (chartConfig.type) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading Excel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chart Analysis</h1>
          <p className="text-gray-600 mt-2">Create interactive visualizations from your Excel data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Chart Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Chart Title</Label>
                <Input
                  id="title"
                  value={chartConfig.title}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  placeholder="Enter chart title"
                  aria-label="Chart title"
                />
              </div>

              <div>
                <Label htmlFor="type">Chart Type</Label>
                <Select value={chartConfig.type} onValueChange={(value) => handleConfigChange('type', value)}>
                  <SelectTrigger aria-label="Select chart type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="xAxis">X-Axis Column</Label>
                <Select value={chartConfig.xAxis} onValueChange={(value) => handleConfigChange('xAxis', value)}>
                  <SelectTrigger aria-label="Select X-axis column">
                    <SelectValue placeholder="Select X-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column} value={column}>{column}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yAxis">Y-Axis Column</Label>
                <Select value={chartConfig.yAxis} onValueChange={(value) => handleConfigChange('yAxis', value)}>
                  <SelectTrigger aria-label="Select Y-axis column">
                    <SelectValue placeholder="Select Y-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column} value={column}>{column}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button onClick={generateChartData} className="w-full" aria-label="Generate chart preview">
                  Generate Chart
                </Button>
                <Button 
                  onClick={handleSaveChart} 
                  variant="outline" 
                  className="w-full"
                  disabled={saving || !chartData}
                  aria-label="Save chart configuration"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Chart'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chart Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Chart Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData ? (
                <div className="w-full h-96">
                  {renderChart()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Configure your chart settings and click "Generate Chart" to see the preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Data Preview */}
        {excelData && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map(column => (
                        <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {excelData.data.slice(0, 10).map((row: any, index: number) => (
                      <tr key={index}>
                        {columns.map(column => (
                          <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChartAnalysisPage;
