
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  StickyNote, 
  BookOpen, 
  Search, 
  Plus, 
  Pencil,
  Trash2,
  Copy,
  MoreVertical,
  X,
  Tag
} from "lucide-react";

// Interface for note objects
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

// Sample notes data
const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Physics: Laws of Motion",
    content: "Newton's First Law: An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.\n\nNewton's Second Law: The acceleration of an object depends on the mass of the object and the amount of force applied.\n\nNewton's Third Law: For every action, there is an equal and opposite reaction.",
    tags: ["physics", "laws", "motion"],
    createdAt: new Date(2025, 4, 1),
    updatedAt: new Date(2025, 4, 2),
    color: "bg-yellow-100"
  },
  {
    id: "2",
    title: "Biology: Cell Structure",
    content: "Cell membrane: Controls what enters and leaves the cell\nCytoplasm: Jelly-like substance where chemical reactions occur\nNucleus: Contains DNA and controls cell activities\nMitochondria: Powerhouse of the cell, produces energy\nEndoplasmic reticulum: Transport system within the cell\nGolgi apparatus: Packages and distributes proteins",
    tags: ["biology", "cells", "organelles"],
    createdAt: new Date(2025, 4, 3),
    updatedAt: new Date(2025, 4, 3),
    color: "bg-green-100"
  },
  {
    id: "3",
    title: "Literature: Symbolism in The Great Gatsby",
    content: "Green Light: Represents Gatsby's hopes and dreams for the future\nValley of Ashes: Symbolizes moral and social decay\nEyes of Dr. T.J. Eckleburg: Represent the eyes of God looking down in judgment\nEast and West Egg: Represents the old money vs new money divide\nDaisy's Voice: Described as 'full of money', representing the allure of wealth",
    tags: ["literature", "gatsby", "symbolism"],
    createdAt: new Date(2025, 4, 4),
    updatedAt: new Date(2025, 4, 5),
    color: "bg-blue-100"
  }
];

// Available note colors
const noteColors = [
  { value: "bg-yellow-100", label: "Yellow" },
  { value: "bg-green-100", label: "Green" },
  { value: "bg-blue-100", label: "Blue" },
  { value: "bg-purple-100", label: "Purple" },
  { value: "bg-pink-100", label: "Pink" },
  { value: "bg-orange-100", label: "Orange" }
];

const StudentNotes = () => {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    tags: [],
    color: "bg-yellow-100"
  });
  const [tagInput, setTagInput] = useState("");
  
  const { toast } = useToast();
  
  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const matchesTitle = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContent = note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTitle || matchesContent || matchesTags;
  });
  
  // Handle form input changes
  const handleInputChange = (field: keyof Note, value: any) => {
    setNewNote({
      ...newNote,
      [field]: value
    });
  };
  
  // Add tag to the note
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const tag = tagInput.trim().toLowerCase();
    if (newNote.tags?.includes(tag)) {
      toast({
        title: "Tag already exists",
        description: `The tag "${tag}" is already added to this note.`
      });
      return;
    }
    
    setNewNote({
      ...newNote,
      tags: [...(newNote.tags || []), tag]
    });
    setTagInput("");
  };
  
  // Remove tag from the note
  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };
  
  // Save note
  const saveNote = () => {
    // Validation
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your note.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    
    if (editingNote) {
      // Update existing note
      const updatedNotes = notes.map((note) => 
        note.id === editingNote.id 
          ? { 
              ...newNote, 
              id: editingNote.id,
              createdAt: editingNote.createdAt,
              updatedAt: now
            } as Note 
          : note
      );
      setNotes(updatedNotes);
      toast({
        title: "Note Updated",
        description: `"${newNote.title}" has been updated.`
      });
    } else {
      // Create new note
      const note: Note = {
        id: `note-${Date.now()}`,
        title: newNote.title || "",
        content: newNote.content || "",
        tags: newNote.tags || [],
        createdAt: now,
        updatedAt: now,
        color: newNote.color || "bg-yellow-100"
      };
      
      setNotes([...notes, note]);
      toast({
        title: "Note Created",
        description: `"${note.title}" has been added to your notes.`
      });
    }
    
    // Reset form and close dialog
    resetForm();
  };
  
  // Delete note
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note Deleted",
      description: "The note has been removed."
    });
  };
  
  // Edit note
  const editNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({...note});
    setIsCreatingNote(true);
  };
  
  // Copy note content to clipboard
  const copyNoteContent = (note: Note) => {
    navigator.clipboard.writeText(note.content);
    toast({
      title: "Copied to Clipboard",
      description: "Note content has been copied to your clipboard."
    });
  };
  
  // Reset form
  const resetForm = () => {
    setNewNote({
      title: "",
      content: "",
      tags: [],
      color: "bg-yellow-100"
    });
    setTagInput("");
    setIsCreatingNote(false);
    setEditingNote(null);
  };
  
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Notes
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
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
              <Dialog open={isCreatingNote} onOpenChange={setIsCreatingNote}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingNote ? "Edit Note" : "Create New Note"}
                    </DialogTitle>
                    <DialogDescription>
                      Capture your ideas, concepts, or study material.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newNote.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Note title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        rows={10}
                        value={newNote.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        placeholder="Write your note here..."
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex flex-wrap gap-2">
                          {noteColors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              className={`h-6 w-6 rounded-full border ${color.value} flex items-center justify-center ${
                                newNote.color === color.value ? "ring-2 ring-primary" : ""
                              }`}
                              onClick={() => handleInputChange("color", color.value)}
                              title={color.label}
                            >
                              {newNote.color === color.value && (
                                <span className="text-xs text-black">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add tag"
                            className="flex-grow"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={addTag}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newNote.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-3 w-3 rounded-full"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button onClick={saveNote}>
                      {editingNote ? "Update Note" : "Save Note"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <CardDescription>
            {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"} {searchQuery && "found"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notes found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first note to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreatingNote(true)}>
                  Create Note
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <Card key={note.id} className={`${note.color} hover:shadow-md transition-shadow`}>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base text-black">{note.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => editNote(note)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyNoteContent(note)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteNote(note.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-xs text-gray-700">
                      {note.updatedAt === note.createdAt
                        ? `Created on ${format(note.createdAt, "MMM d, yyyy")}`
                        : `Updated on ${format(note.updatedAt, "MMM d, yyyy")}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-2">
                    <div className="text-sm line-clamp-6 whitespace-pre-line text-black">
                      {note.content}
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 pt-0 pb-4">
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs text-gray-700 bg-white/50">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentNotes;
