"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft, Phone, Video, MoreVertical } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [currentUser, setCurrentUser] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
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

    // Mock chat users
    const mockUsers: ChatUser[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
      },
      {
        id: "2",
        name: "Support Team",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
      },
      {
        id: "3",
        name: "AI Assistant",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
      },
      {
        id: "4",
        name: "Community Group",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "away",
      },
    ]
    setChatUsers(mockUsers)
    setSelectedUser(mockUsers[0])

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: "Dr. Sarah Johnson",
        content: "Hello! I reviewed your recent analysis. The results look good overall.",
        timestamp: new Date(Date.now() - 3600000),
        isOwn: false,
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "2",
        sender: currentUser,
        content: "Thank you for reviewing it! I was a bit concerned about the results.",
        timestamp: new Date(Date.now() - 3300000),
        isOwn: true,
      },
      {
        id: "3",
        sender: "Dr. Sarah Johnson",
        content:
          "No need to worry. The AI detected some minor skin irritation, but it's nothing serious. I recommend using a gentle moisturizer.",
        timestamp: new Date(Date.now() - 3000000),
        isOwn: false,
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "4",
        sender: currentUser,
        content: "That's a relief! Should I schedule a follow-up?",
        timestamp: new Date(Date.now() - 2700000),
        isOwn: true,
      },
      {
        id: "5",
        sender: "Dr. Sarah Johnson",
        content: "Let's monitor it for a week. If the irritation persists, we can schedule a video consultation.",
        timestamp: new Date(Date.now() - 2400000),
        isOwn: false,
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ]
    setMessages(mockMessages)
  }, [router, currentUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: selectedUser.name,
        content: "Thank you for your message. I'll get back to you shortly.",
        timestamp: new Date(),
        isOwn: false,
        avatar: selectedUser.avatar,
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex h-screen">
        {/* Sidebar - Chat Users */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <LanguageToggle />
            </div>
            <h2 className="text-xl font-bold">{t("chat")}</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.id === user.id ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedUser.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      {!message.isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("typeMessage")}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
