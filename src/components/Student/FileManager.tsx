import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  File, 
  FileImage, 
  FileCode, 
  Download, 
  MoreVertical, 
  Trash2, 
  Share, 
  Edit, 
  FolderPlus,
  Upload,
  Search,
  X,
  ChevronDown,
  Loader2
} from "lucide-react";

// Define file types
const FileTypes = {
  PDF: "pdf",
  DOC: "doc",
  DOCX: "docx",
  IMAGE: "image",
  NOTE: "note",
  PPT: "ppt",
  CODE: "code",
  OTHER: "other"
};

// Interface for file objects
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  category: string;
  file?: File; // The actual file object (optional)
  url?: string; // URL for the file (optional)
  file_path?: string; // Path in supabase storage
}

// Function to get the appropriate icon based on file type
const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case FileTypes.PDF:
      return <FileText className="h-8 w-8 text-red-500" />;
    case FileTypes.DOC:
    case FileTypes.DOCX:
      return <FileText className="h-8 w-8 text-blue-500" />;
    case FileTypes.IMAGE:
      return <FileImage className="h-8 w-8 text-purple-500" />;
    case FileTypes.PPT:
      return <FileText className="h-8 w-8 text-orange-500" />;
    case FileTypes.CODE:
      return <FileCode className="h-8 w-8 text-green-500" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

// Function to get file type from extension
const getFileTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || 'other';
  
  if (['pdf'].includes(extension)) return FileTypes.PDF;
  if (['doc', 'docx'].includes(extension)) return FileTypes.DOC;
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return FileTypes.IMAGE;
  if (['ppt', 'pptx'].includes(extension)) return FileTypes.PPT;
  if (['js', 'py', 'java', 'c', 'cpp', 'html', 'css'].includes(extension)) return FileTypes.CODE;
  if (['txt', 'md'].includes(extension)) return FileTypes.NOTE;
  return FileTypes.OTHER;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("all");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load files from Supabase
  useEffect(() => {
    if (!user) return;
    
    const loadFiles = async () => {
      setLoading(true);
      try {
        // Fetch file metadata from the database
        const { data, error } = await supabase
          .from('study_materials')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const fileItems: FileItem[] = await Promise.all(data.map(async (item) => {
            // Get the signed URL for each file
            const { data: urlData } = await supabase.storage
              .from('study_materials')
              .createSignedUrl(item.file_path, 60); // 60 seconds expiry
              
            return {
              id: item.id,
              name: item.name,
              type: item.file_type,
              size: item.file_size,
              uploadDate: new Date(item.created_at).toISOString().split('T')[0],
              lastModified: new Date(item.updated_at).toISOString().split('T')[0],
              category: item.category,
              file_path: item.file_path,
              url: urlData?.signedUrl
            };
          }));
          
          setFiles(fileItems);
        }
      } catch (error) {
        console.error("Error loading files:", error);
        toast({
          title: "Failed to load files",
          description: "There was an error loading your files.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadFiles();
  }, [user, toast]);
  
  // Filter files based on search query and category
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || file.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  // Handle file upload - now supporting both methods (click and drag)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadingFiles(newFiles);
    }
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setUploadingFiles(droppedFiles);
    }
  };
  
  // Trigger file input click
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Confirm file upload
  const confirmUpload = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const uploadedFiles = await Promise.all(uploadingFiles.map(async (file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'other';
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload file to Supabase Storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('study_materials')
          .upload(filePath, file);
          
        if (storageError) throw storageError;
        
        // Create database entry
        const { data: dbData, error: dbError } = await supabase
          .from('study_materials')
          .insert({
            user_id: user.id,
            name: file.name,
            description: '',
            file_path: filePath,
            file_type: getFileTypeFromExtension(file.name),
            file_size: formatFileSize(file.size),
            category: 'Uploaded'
          })
          .select('*')
          .single();
          
        if (dbError) throw dbError;
        
        // Get the signed URL
        const { data: urlData } = await supabase.storage
          .from('study_materials')
          .createSignedUrl(filePath, 60); // 60 seconds expiry
        
        return {
          id: dbData.id,
          name: dbData.name,
          type: dbData.file_type,
          size: dbData.file_size,
          uploadDate: new Date(dbData.created_at).toISOString().split('T')[0],
          lastModified: new Date(dbData.updated_at).toISOString().split('T')[0],
          category: dbData.category,
          file_path: dbData.file_path,
          url: urlData?.signedUrl
        };
      }));
      
      setFiles([...uploadedFiles, ...files]);
      setIsUploading(false);
      setUploadingFiles([]);
      
      toast({
        title: "Files Uploaded Successfully",
        description: `${uploadedFiles.length} files have been uploaded.`,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file deletion
  const deleteFile = async (id: string, file_path?: string) => {
    if (!user) return;
    
    try {
      // Delete from storage if path exists
      if (file_path) {
        const { error: storageError } = await supabase.storage
          .from('study_materials')
          .remove([file_path]);
          
        if (storageError) throw storageError;
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      // Update local state
      setFiles(files.filter(file => file.id !== id));
      
      toast({
        title: "File Deleted",
        description: "The file has been removed.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the file.",
        variant: "destructive",
      });
    }
  };
  
  // Handle file download
  const downloadFile = (file: FileItem) => {
    if (!file.url) {
      toast({
        title: "Cannot Download File",
        description: "This file doesn't have a valid download URL.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "File Download Started",
      description: `Downloading ${file.name}...`,
    });
  };
  
  // Create new folder
  const createFolder = async () => {
    if (!newFolderName || !user) {
      toast({
        title: "Invalid folder name or not logged in",
        description: "Please provide a folder name and make sure you're logged in.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .insert({
          user_id: user.id,
          name: `${newFolderName} (Folder)`,
          description: 'Folder',
          file_path: 'folder', // Special marker for folders
          file_type: 'folder',
          file_size: '0 KB',
          category: 'Folders'
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      const newFolder: FileItem = {
        id: data.id,
        name: data.name,
        type: data.file_type,
        size: data.file_size,
        uploadDate: new Date(data.created_at).toISOString().split('T')[0],
        lastModified: new Date(data.updated_at).toISOString().split('T')[0],
        category: data.category,
        file_path: data.file_path
      };
      
      setFiles([newFolder, ...files]);
      setNewFolderName("");
      
      toast({
        title: "Folder Created",
        description: `'${newFolderName}' folder has been created.`,
      });
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        title: "Failed to create folder",
        description: "There was an error creating the folder.",
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Please log in</h3>
            <p className="text-sm text-muted-foreground text-center">
              You need to be logged in to view and manage your files.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>My Files</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Dialog open={isUploading} onOpenChange={setIsUploading}>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                      Upload documents, images, and other files to your student repository.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <label 
                      className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${dragActive ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={handleClick}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOCX, PPTX, JPG, PNG (MAX. 10MB)
                        </p>
                      </div>
                      <Input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        onChange={handleFileUpload}
                        multiple 
                      />
                    </label>
                    
                    {uploadingFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Selected Files:</h4>
                        <ScrollArea className="h-28 w-full rounded">
                          <ul className="space-y-2">
                            {uploadingFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsUploading(false);
                      setUploadingFiles([]);
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={confirmUpload} 
                      disabled={uploadingFiles.length === 0 || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>Upload {uploadingFiles.length > 0 && `(${uploadingFiles.length})`}</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new folder.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Folder Name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      onClick={createFolder}
                      disabled={!newFolderName || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>Create Folder</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFiles([...files].sort((a, b) => a.name.localeCompare(b.name)))}>
                    Sort by Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiles([...files].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()))}>
                    Sort by Last Modified
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiles([...files].sort((a, b) => a.type.localeCompare(b.type)))}>
                    Sort by Type
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="Notes">Notes</TabsTrigger>
              <TabsTrigger value="Assignments">Assignments</TabsTrigger>
              <TabsTrigger value="Resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value={category} className="mt-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium">Loading your files...</h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we fetch your files
                  </p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No files found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Try adjusting your search" : "Upload files to get started"}
                  </p>
                  {!searchQuery && (
                    <Button className="mt-4" onClick={() => setIsUploading(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <Card key={file.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <h4 className="text-sm font-medium truncate max-w-[140px]" title={file.name}>
                                {file.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {file.size} • {file.lastModified}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => downloadFile(file)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteFile(file.id, file.file_path)} 
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Badge className="mt-2" variant="outline">{file.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <span>{filteredFiles.length} files</span>
          <span>
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FileManager;
