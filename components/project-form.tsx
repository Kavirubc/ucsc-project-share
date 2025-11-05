'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const CATEGORIES = [
  'Web Development',
  'Mobile App',
  'AI/ML',
  'Data Science',
  'IoT',
  'Game Development',
  'Cybersecurity',
  'Blockchain',
  'Cloud Computing',
  'Other'
]

interface TeamMember {
  name: string
  email: string
  role: string
  indexNumber?: string
}

export function ProjectForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const [slidesDeckUrl, setSlidesDeckUrl] = useState('')
  const [pitchVideoUrl, setPitchVideoUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('')
  const [memberIndex, setMemberIndex] = useState('')

  const [status, setStatus] = useState<'completed' | 'in-progress'>('completed')
  const [isPublic, setIsPublic] = useState(true)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddTeamMember = () => {
    if (memberName.trim() && memberEmail.trim() && memberRole.trim()) {
      setTeamMembers([
        ...teamMembers,
        {
          name: memberName.trim(),
          email: memberEmail.trim(),
          role: memberRole.trim(),
          indexNumber: memberIndex.trim() || undefined
        }
      ])
      setMemberName('')
      setMemberEmail('')
      setMemberRole('')
      setMemberIndex('')
    }
  }

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          tags,
          slidesDeckUrl: slidesDeckUrl || undefined,
          pitchVideoUrl: pitchVideoUrl || undefined,
          demoUrl: demoUrl || undefined,
          githubUrl: githubUrl || undefined,
          teamMembers,
          status,
          isPublic
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create project')
      }

      router.push('/projects')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Smart Attendance System"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project, its purpose, and key features..."
              rows={5}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Technologies/Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="React, Node.js, MongoDB..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                disabled={isLoading}
              />
              <Button type="button" onClick={handleAddTag} disabled={isLoading}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Project Links</h3>

          <div className="space-y-2">
            <Label htmlFor="slidesDeckUrl">Slides Deck URL</Label>
            <Input
              id="slidesDeckUrl"
              type="url"
              value={slidesDeckUrl}
              onChange={(e) => setSlidesDeckUrl(e.target.value)}
              placeholder="https://docs.google.com/presentation/..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pitchVideoUrl">Pitch Video URL</Label>
            <Input
              id="pitchVideoUrl"
              type="url"
              value={pitchVideoUrl}
              onChange={(e) => setPitchVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoUrl">Live Demo URL</Label>
            <Input
              id="demoUrl"
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://your-project.vercel.app"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub Repository</Label>
            <Input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Team Members</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Name</Label>
              <Input
                id="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberEmail">Email</Label>
              <Input
                id="memberEmail"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="john@stu.ucsc.cmb.ac.lk"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberRole">Role</Label>
              <Input
                id="memberRole"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                placeholder="Frontend Developer"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberIndex">Index Number (Optional)</Label>
              <Input
                id="memberIndex"
                value={memberIndex}
                onChange={(e) => setMemberIndex(e.target.value)}
                placeholder="2022IS031"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="button" onClick={handleAddTeamMember} variant="outline" disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>

          {teamMembers.length > 0 && (
            <div className="space-y-2">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role} • {member.email}
                      {member.indexNumber && ` • ${member.indexNumber}`}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTeamMember(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Creating...' : 'Create Project'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
