"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, MessageCircle, Heart, Share, MoreHorizontal, Send, ImageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import Image from "next/image"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
  avatar?: string
  likes: number
  isLiked: boolean
}

interface Post {
  id: string
  author: string
  title: string
  content: string
  category: "general" | "health" | "analysis" | "tips" | "question"
  timestamp: Date
  avatar?: string
  image?: string
  likes: number
  isLiked: boolean
  comments: Comment[]
  commentsCount: number
}

interface NewPostData {
  title: string
  content: string
  category: "general" | "health" | "analysis" | "tips" | "question"
  image?: string
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isOwn: boolean
  avatar?: string
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen?: Date
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [currentUser, setCurrentUser] = useState<string>("")
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false)
  const [newPostData, setNewPostData] = useState<NewPostData>({
    title: "",
    content: "",
    category: "general",
  })
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/login")
      return
    }

    const userName = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "User"
    setCurrentUser(userName)

    // Mock community posts
    const mockPosts: Post[] = [
      {
        id: "1",
        author: "Dr. Sarah Johnson",
        title: "Understanding Skin Analysis Results",
        content:
          "Many users ask about interpreting their skin analysis results. Here's a comprehensive guide to help you understand what the AI is detecting and what the confidence levels mean.",
        category: "health",
        timestamp: new Date(Date.now() - 7200000),
        avatar: "/placeholder.svg?height=40&width=40",
        likes: 24,
        isLiked: false,
        commentsCount: 8,
        comments: [
          {
            id: "c1",
            author: "Mike Chen",
            content: "This is really helpful! I was confused about the confidence percentages.",
            timestamp: new Date(Date.now() - 3600000),
            avatar: "/placeholder.svg?height=32&width=32",
            likes: 5,
            isLiked: true,
          },
          {
            id: "c2",
            author: "Lisa Wang",
            content: "Could you explain more about the severity levels?",
            timestamp: new Date(Date.now() - 1800000),
            likes: 2,
            isLiked: false,
          },
        ],
      },
      {
        id: "2",
        author: "Alex Rodriguez",
        title: "My Plant Analysis Journey",
        content:
          "I've been using the app to analyze my garden plants for 3 months now. Here are some interesting findings and tips I'd like to share with the community.",
        category: "analysis",
        timestamp: new Date(Date.now() - 14400000),
        avatar: "/placeholder.svg?height=40&width=40",
        image: "/placeholder.svg?height=200&width=300",
        likes: 18,
        isLiked: true,
        commentsCount: 12,
        comments: [
          {
            id: "c3",
            author: "Green Thumb",
            content: "Amazing results! What type of plants did you analyze?",
            timestamp: new Date(Date.now() - 10800000),
            likes: 3,
            isLiked: false,
          },
        ],
      },
      {
        id: "3",
        author: "Community Helper",
        title: "Tips for Better Image Quality",
        content:
          "Getting accurate analysis results depends heavily on image quality. Here are some tips to improve your photos for better AI analysis.",
        category: "tips",
        timestamp: new Date(Date.now() - 21600000),
        avatar: "/placeholder.svg?height=40&width=40",
        likes: 31,
        isLiked: false,
        commentsCount: 15,
        comments: [
          {
            id: "c4",
            author: "Photo Pro",
            content: "Lighting is definitely key! Natural light works best.",
            timestamp: new Date(Date.now() - 18000000),
            likes: 8,
            isLiked: true,
          },
          {
            id: "c5",
            author: "New User",
            content: "Thanks for the tips! My results improved significantly.",
            timestamp: new Date(Date.now() - 14400000),
            likes: 4,
            isLiked: false,
          },
        ],
      },
      {
        id: "4",
        author: "Jane Smith",
        title: "Question about Food Analysis",
        content:
          "Has anyone tried analyzing different types of cuisine? I'm curious about the accuracy for international foods.",
        category: "question",
        timestamp: new Date(Date.now() - 28800000),
        avatar: "/placeholder.svg?height=40&width=40",
        likes: 12,
        isLiked: false,
        commentsCount: 6,
        comments: [
          {
            id: "c6",
            author: "Food Expert",
            content: "I've tested it with Asian cuisine and it works quite well!",
            timestamp: new Date(Date.now() - 25200000),
            likes: 6,
            isLiked: false,
          },
        ],
      },
    ]
    setPosts(mockPosts)
    setFilteredPosts(mockPosts)
  }, [router])

  // Filter posts by category
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter((post) => post.category === categoryFilter))
    }
  }, [posts, categoryFilter])

  const handleCreatePost = () => {
    if (!newPostData.title.trim() || !newPostData.content.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      title: newPostData.title,
      content: newPostData.content,
      category: newPostData.category,
      timestamp: new Date(),
      image: newPostData.image,
      likes: 0,
      isLiked: false,
      comments: [],
      commentsCount: 0,
    }

    setPosts([newPost, ...posts])
    setIsNewPostDialogOpen(false)
    setNewPostData({
      title: "",
      content: "",
      category: "general",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPostData({ ...newPostData, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post,
      ),
    )
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                      isLiked: !comment.isLiked,
                    }
                  : comment,
              ),
            }
          : post,
      ),
    )
  }

  const handleAddComment = (postId: string) => {
    const commentContent = newComments[postId]
    if (!commentContent?.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: commentContent,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    }

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
              commentsCount: post.commentsCount + 1,
            }
          : post,
      ),
    )

    setNewComments({ ...newComments, [postId]: "" })
  }

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedComments(newExpanded)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-red-100 text-red-800"
      case "analysis":
        return "bg-blue-100 text-blue-800"
      case "tips":
        return "bg-green-100 text-green-800"
      case "question":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "health":
        return "Health"
      case "analysis":
        return "Analysis"
      case "tips":
        return "Tips"
      case "question":
        return "Question"
      default:
        return "General"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Community</h1>
              <p className="text-muted-foreground">Share experiences and get help from the community</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
          </div>
        </div>

        {/* Create Post Button and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>Share your thoughts, questions, or experiences with the community</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    placeholder="Enter post title..."
                    value={newPostData.title}
                    onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="post-category">Category</Label>
                  <Select
                    value={newPostData.category}
                    onValueChange={(value: any) => setNewPostData({ ...newPostData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="tips">Tips</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="post-content">Content</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Write your post content..."
                    rows={4}
                    value={newPostData.content}
                    onChange={(e) => setNewPostData({ ...newPostData, content: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Image (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Add Image</span>
                    </Button>
                    {newPostData.image && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setNewPostData({ ...newPostData, image: undefined })}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {newPostData.image && (
                    <div className="mt-2">
                      <Image
                        src={newPostData.image || "/placeholder.svg"}
                        alt="Post image"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewPostDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>Create Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="tips">Tips</SelectItem>
              <SelectItem value="question">Question</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{post.author}</h3>
                        <Badge className={getCategoryColor(post.category)}>{getCategoryLabel(post.category)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatTime(post.timestamp)}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Report Post</DropdownMenuItem>
                      {post.author === currentUser && (
                        <>
                          <DropdownMenuItem>Edit Post</DropdownMenuItem>
                          <DropdownMenuItem>Delete Post</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <CardDescription className="text-base text-foreground">{post.content}</CardDescription>
                </div>
                {post.image && (
                  <div className="mt-4">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Post image"
                      width={400}
                      height={250}
                      className="rounded-lg object-cover w-full max-h-64"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {/* Post Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 ${post.isLiked ? "text-red-500" : ""}`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="space-y-4 border-t pt-4">
                    {/* Existing Comments */}
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{formatTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeComment(post.id, comment.id)}
                              className={`text-xs ${comment.isLiked ? "text-red-500" : ""}`}
                            >
                              <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                              {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {currentUser
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Input
                          placeholder="Write a comment..."
                          value={newComments[post.id] || ""}
                          onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        />
                        <Button size="sm" onClick={() => handleAddComment(post.id)}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              {categoryFilter === "all" ? "Be the first to create a post!" : "No posts in this category yet."}
            </p>
            <Button onClick={() => setIsNewPostDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
