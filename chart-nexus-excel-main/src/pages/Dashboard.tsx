
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BarChart, FileText, PieChart, Loader2 } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';
import { ExcelFile } from '@/types/fileTypes';

const Dashboard: React.FC = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [excelFiles, setExcelFiles] = useState<ExcelFile[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API when backend is ready
      setTimeout(() => {
        setExcelFiles([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load files');
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    
    try {
      // Replace this simulation with actual API call when backend is ready
      const formData = new FormData();
      formData.append("file", uploadFile);

      // Simulated upload - replace with actual API call
      setTimeout(() => {
        const newFile: ExcelFile = {
          _id: Date.now().toString(),
          filename: uploadFile.name,
          uploadDate: new Date().toISOString(),
          size: uploadFile.size
        };
        
        setExcelFiles(prev => [newFile, ...prev]);
        toast.success('Excel file uploaded successfully!');
        setUploadFile(null);
        setUploading(false);
      }, 2000);

      /* 
      // Uncomment when backend is ready:
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setExcelFiles(prev => [data.file, ...prev]);
        toast.success("Excel file uploaded successfully!");
      } else {
        toast.error(data.message || "Upload failed");
      }
      */
    } catch (error) {
      toast.error("Something went wrong while uploading");
      setUploading(false);
    } finally {
      setUploadFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Excel Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Upload and analyze your Excel data with interactive charts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Excel Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{excelFiles.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Charts</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Bar, Line, Pie, Scatter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready to Analyze</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">✓</div>
              <p className="text-xs text-muted-foreground">Start uploading data</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Excel File</CardTitle>
            <CardDescription>Upload your Excel files (.xlsx, .xls) for analysis and visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="flex-1"
                aria-label="Select Excel file to upload"
              />
              <Button 
                onClick={handleFileUpload} 
                disabled={uploading || !uploadFile}
                aria-label="Upload selected Excel file"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>Your Excel files ready for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading files...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {excelFiles.map((file) => (
                  <div key={file._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(file.uploadDate).toLocaleDateString()} • {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/chart-analysis?fileId=${file._id}`} aria-label={`Analyze ${file.filename}`}>
                        Analyze
                      </a>
                    </Button>
                  </div>
                ))}
                {excelFiles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No Excel files uploaded yet</p>
                    <p className="text-sm">Upload your first file to get started with data analysis</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
